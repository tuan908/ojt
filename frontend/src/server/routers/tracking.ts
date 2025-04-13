import {eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {ErrorCodes} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';
import {nullsToUndefined, tryCatch} from '~/shared/utils';
import {createErrorResponse, createSuccessResponse} from '../lib/api-response';
import DbSchema from '../schema';

const trackingRouter = new Hono().get('/', async c => {
  const {student_code} = c.req.query();
  if (!student_code) {
    return c.json(
      createErrorResponse({
        code: ErrorCodes.BAD_REQUEST,
        message: json.error.badRequest,
        statusCode: 404,
      }),
    );
  }

  const db = c.get('db');

  const [student] = await db
    .select({
      id: DbSchema.Student.id,
      code: DbSchema.Student.code,
      fullname: DbSchema.User.name,
    })
    .from(DbSchema.Student)
    .innerJoin(DbSchema.User, eq(DbSchema.Student.userId, DbSchema.User.id))
    .where(eq(DbSchema.Student.code, student_code!));

  if (!student) {
    return c.json(
      createErrorResponse({
        code: ErrorCodes.NOT_FOUND,
        message: json.error.notFound,
        statusCode: 404,
      }),
    );
  }

  // First, fetch all grades from the database
  const allGradesPromise = db
    .select({
      id: DbSchema.Grade.id,
      name: DbSchema.Grade.name,
    })
    .from(DbSchema.Grade)
    .orderBy(DbSchema.Grade.id);

  const trackingPromise = db
    .select({
      hashtagId: DbSchema.StudentHashtag.hashtagId,
      hashtagName: DbSchema.Hashtag.name,
      count: DbSchema.StudentHashtag.count,
      gradeName: DbSchema.Grade.name,
    })
    .from(DbSchema.StudentHashtag)
    .innerJoin(
      DbSchema.Student,
      eq(DbSchema.StudentHashtag.studentId, DbSchema.Student.id),
    )
    .innerJoin(
      DbSchema.Hashtag,
      eq(DbSchema.StudentHashtag.hashtagId, DbSchema.Hashtag.id),
    )
    .leftJoin(
      DbSchema.StudentEvent,
      eq(DbSchema.Student.id, DbSchema.StudentEvent.studentId),
    )
    .leftJoin(
      DbSchema.Grade,
      eq(DbSchema.StudentEvent.gradeId, DbSchema.Grade.id),
    )
    .where(eq(DbSchema.Student.code, student_code))
    .groupBy(
      DbSchema.StudentHashtag.hashtagId,
      DbSchema.Hashtag.name,
      DbSchema.StudentHashtag.count,
      DbSchema.Grade.name,
    )
    .orderBy(DbSchema.StudentHashtag.hashtagId);

  // Execute both queries in parallel
  const [{data: allGrades = []}, {data: rows = [], error}] = await Promise.all([
    tryCatch(allGradesPromise),
    tryCatch(trackingPromise),
  ]);

  if (error) throw error;

  if (!rows || !allGrades || rows?.length === 0)
    return c.json(createSuccessResponse(null));

  // Get all unique hashtag names
  const hashtagNames = [
    ...new Set(rows.map(row => row.hashtagName!).filter(Boolean)),
  ];

  // Get all grade names (including N/A)
  const gradeNamesFromData = [
    ...new Set(rows.map(row => row.gradeName ?? 'N/A')),
  ];
  const allGradeNames = [
    ...new Set([
      ...allGrades.map(grade => grade.name!),
      ...(gradeNamesFromData.includes('N/A') ? ['N/A'] : []),
    ]),
  ];

  // Create a mapping of hashtag to grade counts
  const hashtagGradeCounts: Record<string, Record<string, number>> = {};

  // Initialize with zeros for all hashtags and all grades
  hashtagNames.forEach(hashtagName => {
    hashtagGradeCounts[hashtagName] = {};
    allGradeNames.forEach(gradeName => {
      hashtagGradeCounts[hashtagName]![gradeName] = 0;
    });
  });

  // Fill in the actual counts
  rows.forEach(row => {
    const gradeName = row.gradeName ?? 'N/A';
    const hashtagName = row.hashtagName;
    if (hashtagName) {
      hashtagGradeCounts[hashtagName]![gradeName] = row.count ?? 0;
    }
  });

  // Build the series data for all hashtags
  const series = hashtagNames.map(hashtagName => {
    return {
      name: hashtagName,
      data: allGradeNames.map(
        gradeName => hashtagGradeCounts[hashtagName]![gradeName],
      ),
      type: 'bar',
      stack: '#ハッシュタグ',
    };
  });

  const response = createSuccessResponse(
    nullsToUndefined({
      id: student.id,
      code: student.code,
      name: student.fullname,
      hashtags: {
        doughnut: {
          _data: rows.map(row => ({
            name: row.hashtagName,
            value: row.count ?? 0,
          })),
          text: rows.reduce((sum, {count}) => sum + (count ?? 0), 0).toString(),
        },
        stacked: {
          xAxis: {
            data: allGradeNames,
          },
          series: series,
        },
      },
    }),
  );

  return c.json(response);
});

export default trackingRouter;
