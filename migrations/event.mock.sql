CREATE TABLE ojt_event (
  id bigint,
  studentCode text,
  studentName text,
  schoolYear text,
  events list<text>,
  hashtags list<text>,
  PRIMARY KEY (id, studentName, studentCode)
);

insert into ojt_event (id,studentCode,studentName,schoolYear,events,hashtags) values (1,'3','Minh Tran Binh', '8', ['Event 7', 'Soccer', 'Badminton'],{, color,'#ability to quickly grasp', '#discipline']);
alter table ojt_event drop schoolYear;
alter table ojt_event add schoolYear bigint;
