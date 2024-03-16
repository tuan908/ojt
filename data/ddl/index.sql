CREATE TABLE OJT_ACCOUNT(
    "id" serial primary key,
    "user_id" int8,
    "username" text,
    "password" text,
    "created_on" timestamp(6),
    "created_by" text,
    "updated_on" timestamp(6),
    "updated_by" text
)

CREATE TABLE ojt_user (
    "id" serial primary key,
    "name" int8,
    "role" text,
    "created_on" timestamp(6),
    "created_by" text,
    "updated_on" timestamp(6),
    "updated_by" text
)