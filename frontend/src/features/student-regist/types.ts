export interface IUpdateEventStatusDto {
  event_id: number;
  updated_by: string;
  student_code: string;
}

export interface ICreateStudentEventResponseDto {
  id: number;
}
