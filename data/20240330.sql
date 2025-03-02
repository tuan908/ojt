--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: t_comment; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_comment (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    content character varying(255),
    is_deleted boolean,
    user_id bigint,
    event_detail_id bigint
);


ALTER TABLE public.t_comment OWNER TO tuan908;

--
-- Name: t_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_comment_id_seq OWNER TO tuan908;

--
-- Name: t_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuan908
--

ALTER SEQUENCE public.t_comment_id_seq OWNED BY public.t_comment.id;


--
-- Name: t_event; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_event (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    description text,
    name text,
    title text
);


ALTER TABLE public.t_event OWNER TO tuan908;

--
-- Name: t_event_detail; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_event_detail (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    created_by character varying(255),
    data jsonb,
    status integer,
    updated_by character varying(255),
    detail_id bigint,
    grade_id bigint,
    student_id bigint
);


ALTER TABLE public.t_event_detail OWNER TO tuan908;

--
-- Name: t_event_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_event_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_event_detail_id_seq OWNER TO tuan908;

--
-- Name: t_event_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuan908
--

ALTER SEQUENCE public.t_event_detail_id_seq OWNED BY public.t_event_detail.id;


--
-- Name: t_grade; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_grade (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    name character varying(255)
);


ALTER TABLE public.t_grade OWNER TO tuan908;

--
-- Name: t_grade_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_grade_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_grade_seq OWNER TO tuan908;

--
-- Name: t_hashtag; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_hashtag (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    color character varying(255),
    name character varying(255) NOT NULL,
    student_id bigint
);


ALTER TABLE public.t_hashtag OWNER TO tuan908;

--
-- Name: t_hashtag_id_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_hashtag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_hashtag_id_seq OWNER TO tuan908;

--
-- Name: t_hashtag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuan908
--

ALTER SEQUENCE public.t_hashtag_id_seq OWNED BY public.t_hashtag.id;


--
-- Name: t_student; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_student (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    code text,
    name text,
    user_id bigint,
    grade_id bigint
);


ALTER TABLE public.t_student OWNER TO tuan908;

--
-- Name: t_student_hashtag; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_student_hashtag (
    student_id bigint NOT NULL,
    hashtag_id bigint NOT NULL
);


ALTER TABLE public.t_student_hashtag OWNER TO tuan908;

--
-- Name: t_student_id_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_student_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_student_id_seq OWNER TO tuan908;

--
-- Name: t_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuan908
--

ALTER SEQUENCE public.t_student_id_seq OWNED BY public.t_student.id;


--
-- Name: t_user; Type: TABLE; Schema: public; Owner: tuan908
--

CREATE TABLE public.t_user (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    name text,
    password text NOT NULL,
    role text,
    username text NOT NULL
);


ALTER TABLE public.t_user OWNER TO tuan908;

--
-- Name: t_user_id_seq; Type: SEQUENCE; Schema: public; Owner: tuan908
--

CREATE SEQUENCE public.t_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_user_id_seq OWNER TO tuan908;

--
-- Name: t_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tuan908
--

ALTER SEQUENCE public.t_user_id_seq OWNED BY public.t_user.id;


--
-- Name: t_comment id; Type: DEFAULT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_comment ALTER COLUMN id SET DEFAULT nextval('public.t_comment_id_seq'::regclass);


--
-- Name: t_event_detail id; Type: DEFAULT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event_detail ALTER COLUMN id SET DEFAULT nextval('public.t_event_detail_id_seq'::regclass);


--
-- Name: t_hashtag id; Type: DEFAULT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_hashtag ALTER COLUMN id SET DEFAULT nextval('public.t_hashtag_id_seq'::regclass);


--
-- Name: t_student id; Type: DEFAULT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student ALTER COLUMN id SET DEFAULT nextval('public.t_student_id_seq'::regclass);


--
-- Name: t_user id; Type: DEFAULT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_user ALTER COLUMN id SET DEFAULT nextval('public.t_user_id_seq'::regclass);


--
-- Data for Name: t_comment; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_comment (id, created_at, updated_at, content, is_deleted, user_id, event_detail_id) FROM stdin;
3	2024-03-30 16:48:49.253913	2024-03-30 16:48:49.253913	Test comment #1111😍😘😜😅😅🤣🙂🙂😅😍😊🫠😀	f	4	4
4	2024-03-30 16:56:18.710059	2024-03-30 16:56:18.710059	#Strategic test comment	f	1	4
\.


--
-- Data for Name: t_event; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_event (id, created_at, updated_at, description, name, title) FROM stdin;
1	2024-03-30 13:34:31.890734	2024-03-30 13:34:31.890734	\N	Sports Day	\N
2	2024-03-30 13:34:31.89612	2024-03-30 13:34:31.89612	\N	Science Fair	\N
3	2024-03-30 13:34:31.900815	2024-03-30 13:34:31.900815	\N	Music Competition	\N
4	2024-03-30 13:34:31.905607	2024-03-30 13:34:31.905607	\N	Art Exhibition	\N
5	2024-03-30 13:34:31.909978	2024-03-30 13:34:31.909978	\N	Debate Competition	\N
6	2024-03-30 13:34:31.913764	2024-03-30 13:34:31.913764	\N	Field Trip	\N
7	2024-03-30 13:34:31.917635	2024-03-30 13:34:31.917635	\N	Cultural Festival	\N
8	2024-03-30 13:34:31.922289	2024-03-30 13:34:31.922289	\N	Math Olympiad	\N
9	2024-03-30 13:34:31.926494	2024-03-30 13:34:31.926494	\N	Literature Contest	\N
\.


--
-- Data for Name: t_event_detail; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_event_detail (id, created_at, updated_at, created_by, data, status, updated_by, detail_id, grade_id, student_id) FROM stdin;
4	2024-03-30 16:47:23.83636	2024-03-30 16:47:23.837359	student0001	{"myAction": null, "eventName": "Music Competition", "myThought": null, "shownPower": null, "strengthGrown": null, "eventsInSchoolLife": null}	1	student0001	3	1	1
\.


--
-- Data for Name: t_grade; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_grade (id, created_at, updated_at, name) FROM stdin;
1	2024-03-19 16:36:20.03789	2024-03-19 16:36:20.03789	Grade 1
2	2024-03-19 16:36:20.041854	2024-03-19 16:36:20.041854	Grade 2
3	2024-03-19 16:36:20.043903	2024-03-19 16:36:20.043903	Grade 3
4	2024-03-19 16:36:20.04554	2024-03-19 16:36:20.04554	Grade 4
5	2024-03-19 16:36:20.047371	2024-03-19 16:36:20.047371	Grade 5
6	2024-03-19 16:36:20.048791	2024-03-19 16:36:20.048791	Grade 6
7	2024-03-19 16:36:20.050299	2024-03-19 16:36:20.050299	Grade 7
8	2024-03-19 16:36:20.051875	2024-03-19 16:36:20.051875	Grade 8
9	2024-03-19 16:36:20.053914	2024-03-19 16:36:20.053914	Grade 9
10	2024-03-19 16:36:20.056287	2024-03-19 16:36:20.056287	Grade 10
11	2024-03-19 16:36:20.058741	2024-03-19 16:36:20.058741	Grade 11
12	2024-03-19 16:36:20.060995	2024-03-19 16:36:20.060995	Grade 12
\.


--
-- Data for Name: t_hashtag; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_hashtag (id, created_at, updated_at, color, name, student_id) FROM stdin;
1	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#f2b2bf	#Proactive	\N
2	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#fb5252	#Influential	\N
3	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#fca120	#Actionable	\N
4	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#edb183	#Problem-solving	\N
5	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#fcde88	#Strategic	\N
6	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#bdd333	#Creative	\N
7	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#4ad295	#Expressive	\N
8	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#92cdfa	#Receptive	\N
9	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#1273eb	#Flexible	\N
10	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#8080f1	#Aware	\N
11	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#bac8d3	#Disciplined	\N
12	2024-03-08 03:06:10.863	2024-03-08 03:06:10.863	#58595b	#Stress-resistant	\N
\.


--
-- Data for Name: t_student; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_student (id, created_at, updated_at, code, name, user_id, grade_id) FROM stdin;
1	2024-03-19 10:09:34.603632	2024-03-19 10:09:34.603632	ST0001	Student 0001	4	1
2	2024-03-19 10:09:34.606321	2024-03-19 10:09:34.606321	ST0002	Student 0002	5	4
3	2024-03-19 10:09:34.60874	2024-03-19 10:09:34.60874	ST0003	Student0003	6	8
\.


--
-- Data for Name: t_student_hashtag; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_student_hashtag (student_id, hashtag_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
2	1
2	2
2	3
3	4
3	5
3	6
3	7
\.


--
-- Data for Name: t_user; Type: TABLE DATA; Schema: public; Owner: tuan908
--

COPY public.t_user (id, created_at, updated_at, name, password, role, username) FROM stdin;
1	2024-03-19 10:06:54.063314	2024-03-19 10:06:54.063314	Counselor	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$1cLm/aCQjTqFd+NyuoxclA	004	counselor1
2	2024-03-19 10:06:54.068447	2024-03-19 10:06:54.068447	Teacher	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$4Zlfln2ruYfK2qDR5zqwXA	003	teacher1
3	2024-03-19 10:06:54.071323	2024-03-19 10:06:54.071323	Parent	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$/j7ezdJ8l9GagFqEhZBDPg	002	parent1
4	2024-03-19 10:06:54.074018	2024-03-19 10:06:54.074018	Student 0001	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$xBYOgCRrKnIa2lR4tNofMA	001	student0001
5	2024-03-19 10:06:54.076747	2024-03-19 10:06:54.076747	Student 0002	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$ziTB3dtpnKrtop2FReKwbg	001	student0002
6	2024-03-19 10:06:54.079079	2024-03-19 10:06:54.079079	Student 0003	$argon2id$v=19$m=16,t=2,p=1$clB5SDRLZ0tVZzhyWDlqMw$ZPGClKmkJ1BOownAa5jO7w	001	student0003
\.


--
-- Name: t_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_comment_id_seq', 4, true);


--
-- Name: t_event_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_event_detail_id_seq', 4, true);


--
-- Name: t_grade_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_grade_seq', 1, false);


--
-- Name: t_hashtag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_hashtag_id_seq', 12, true);


--
-- Name: t_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_student_id_seq', 4, true);


--
-- Name: t_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tuan908
--

SELECT pg_catalog.setval('public.t_user_id_seq', 6, true);


--
-- Name: t_comment t_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT t_comment_pkey PRIMARY KEY (id);


--
-- Name: t_event_detail t_event_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event_detail
    ADD CONSTRAINT t_event_detail_pkey PRIMARY KEY (id);


--
-- Name: t_event t_event_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event
    ADD CONSTRAINT t_event_pkey PRIMARY KEY (id);


--
-- Name: t_grade t_grade_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_grade
    ADD CONSTRAINT t_grade_pkey PRIMARY KEY (id);


--
-- Name: t_hashtag t_hashtag_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_hashtag
    ADD CONSTRAINT t_hashtag_pkey PRIMARY KEY (id);


--
-- Name: t_student_hashtag t_student_hashtag_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student_hashtag
    ADD CONSTRAINT t_student_hashtag_pkey PRIMARY KEY (student_id, hashtag_id);


--
-- Name: t_student t_student_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student
    ADD CONSTRAINT t_student_pkey PRIMARY KEY (id);


--
-- Name: t_user t_user_pkey; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_user
    ADD CONSTRAINT t_user_pkey PRIMARY KEY (id);


--
-- Name: t_user uk_dtct3pv9tjgmspf5ml032nq9t; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_user
    ADD CONSTRAINT uk_dtct3pv9tjgmspf5ml032nq9t UNIQUE (username);


--
-- Name: t_user uk_lv3ctue2jdrx3yefl38nrbrk6; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_user
    ADD CONSTRAINT uk_lv3ctue2jdrx3yefl38nrbrk6 UNIQUE (username);


--
-- Name: t_student uk_ml8urymsgdys13eurb08gv141; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student
    ADD CONSTRAINT uk_ml8urymsgdys13eurb08gv141 UNIQUE (user_id);


--
-- Name: t_hashtag uk_nyq9q6kuipomfx2sr5mrne7k4; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_hashtag
    ADD CONSTRAINT uk_nyq9q6kuipomfx2sr5mrne7k4 UNIQUE (name);


--
-- Name: t_hashtag uk_qbkteo77l0ovcxvdvc999jjns; Type: CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_hashtag
    ADD CONSTRAINT uk_qbkteo77l0ovcxvdvc999jjns UNIQUE (name);


--
-- Name: t_student fk3k5hn6ngsdiu3bd374xag5j8m; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student
    ADD CONSTRAINT fk3k5hn6ngsdiu3bd374xag5j8m FOREIGN KEY (grade_id) REFERENCES public.t_grade(id);


--
-- Name: t_event_detail fk5shebexlcj9nva8r96le9w22f; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event_detail
    ADD CONSTRAINT fk5shebexlcj9nva8r96le9w22f FOREIGN KEY (grade_id) REFERENCES public.t_grade(id);


--
-- Name: t_student_hashtag fk70w0l4w4t65tos3xykpq64vx7; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student_hashtag
    ADD CONSTRAINT fk70w0l4w4t65tos3xykpq64vx7 FOREIGN KEY (student_id) REFERENCES public.t_student(id);


--
-- Name: t_comment fk946h3goyitsaoxs6s07sxfpws; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT fk946h3goyitsaoxs6s07sxfpws FOREIGN KEY (event_detail_id) REFERENCES public.t_event_detail(id);


--
-- Name: t_student_hashtag fk9c8nmc7nerk5b97nqvailxm5c; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student_hashtag
    ADD CONSTRAINT fk9c8nmc7nerk5b97nqvailxm5c FOREIGN KEY (hashtag_id) REFERENCES public.t_hashtag(id);


--
-- Name: t_comment fkanhlc7cjgsv6celtrpf77kd9d; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT fkanhlc7cjgsv6celtrpf77kd9d FOREIGN KEY (event_detail_id) REFERENCES public.t_event(id);


--
-- Name: t_student fkd8bjhbyc92kyw7mufi6djttv6; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_student
    ADD CONSTRAINT fkd8bjhbyc92kyw7mufi6djttv6 FOREIGN KEY (user_id) REFERENCES public.t_user(id);


--
-- Name: t_event_detail fkepe0vwkwtejbdoyk65gtm10k9; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event_detail
    ADD CONSTRAINT fkepe0vwkwtejbdoyk65gtm10k9 FOREIGN KEY (detail_id) REFERENCES public.t_event(id);


--
-- Name: t_hashtag fkj3saerbe8af7gmnvtn14l3che; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_hashtag
    ADD CONSTRAINT fkj3saerbe8af7gmnvtn14l3che FOREIGN KEY (student_id) REFERENCES public.t_student(id);


--
-- Name: t_event_detail fkkpna66l6451klii6096484l9s; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_event_detail
    ADD CONSTRAINT fkkpna66l6451klii6096484l9s FOREIGN KEY (student_id) REFERENCES public.t_student(id);


--
-- Name: t_comment fkleadf9r75a78wy3i68xytr47m; Type: FK CONSTRAINT; Schema: public; Owner: tuan908
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT fkleadf9r75a78wy3i68xytr47m FOREIGN KEY (user_id) REFERENCES public.t_user(id);


--
-- PostgreSQL database dump complete
--

