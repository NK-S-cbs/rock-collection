--
-- PostgreSQL database dump
--

\restrict u1OCsZvbrhZ9DXEXbSEWhnnlli9gGRfbua8BsbDLNuO2YVPt3yNk1ZJQ2tiJ2jF

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.0

-- Started on 2026-03-11 10:05:09 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 227 (class 1259 OID 16555)
-- Name: borrowers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrowers (
    borrower_id integer NOT NULL,
    name character varying(100) NOT NULL,
    institution character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    join_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.borrowers OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16554)
-- Name: borrowers_borrower_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrowers_borrower_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrowers_borrower_id_seq OWNER TO postgres;

--
-- TOC entry 3881 (class 0 OID 0)
-- Dependencies: 226
-- Name: borrowers_borrower_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrowers_borrower_id_seq OWNED BY public.borrowers.borrower_id;


--
-- TOC entry 229 (class 1259 OID 16569)
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    loan_id integer NOT NULL,
    rock_id integer,
    borrower_id integer,
    loan_date date DEFAULT CURRENT_DATE,
    due_date date NOT NULL,
    return_date date
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16568)
-- Name: loans_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loans_loan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loans_loan_id_seq OWNER TO postgres;

--
-- TOC entry 3882 (class 0 OID 0)
-- Dependencies: 228
-- Name: loans_loan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loans_loan_id_seq OWNED BY public.loans.loan_id;


--
-- TOC entry 224 (class 1259 OID 16533)
-- Name: minerals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.minerals (
    mineral_id integer NOT NULL,
    name character varying(200) NOT NULL,
    chemical_formula character varying(200)
);


ALTER TABLE public.minerals OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16532)
-- Name: minerals_mineral_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.minerals_mineral_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.minerals_mineral_id_seq OWNER TO postgres;

--
-- TOC entry 3883 (class 0 OID 0)
-- Dependencies: 223
-- Name: minerals_mineral_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.minerals_mineral_id_seq OWNED BY public.minerals.mineral_id;


--
-- TOC entry 225 (class 1259 OID 16541)
-- Name: rockminerals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rockminerals (
    rock_id integer,
    mineral_id integer
);


ALTER TABLE public.rockminerals OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16517)
-- Name: rocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rocks (
    rock_id integer NOT NULL,
    name character varying(200) NOT NULL,
    rock_type_id integer,
    texture character varying(200),
    color character varying(200)
);


ALTER TABLE public.rocks OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16516)
-- Name: rocks_rock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rocks_rock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rocks_rock_id_seq OWNER TO postgres;

--
-- TOC entry 3884 (class 0 OID 0)
-- Dependencies: 221
-- Name: rocks_rock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rocks_rock_id_seq OWNED BY public.rocks.rock_id;


--
-- TOC entry 220 (class 1259 OID 16508)
-- Name: rocktypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rocktypes (
    rock_type_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200)
);


ALTER TABLE public.rocktypes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16507)
-- Name: rocktypes_rock_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rocktypes_rock_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rocktypes_rock_type_id_seq OWNER TO postgres;

--
-- TOC entry 3885 (class 0 OID 0)
-- Dependencies: 219
-- Name: rocktypes_rock_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rocktypes_rock_type_id_seq OWNED BY public.rocktypes.rock_type_id;


--
-- TOC entry 3697 (class 2604 OID 16558)
-- Name: borrowers borrower_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowers ALTER COLUMN borrower_id SET DEFAULT nextval('public.borrowers_borrower_id_seq'::regclass);


--
-- TOC entry 3699 (class 2604 OID 16572)
-- Name: loans loan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans ALTER COLUMN loan_id SET DEFAULT nextval('public.loans_loan_id_seq'::regclass);


--
-- TOC entry 3696 (class 2604 OID 16536)
-- Name: minerals mineral_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minerals ALTER COLUMN mineral_id SET DEFAULT nextval('public.minerals_mineral_id_seq'::regclass);


--
-- TOC entry 3695 (class 2604 OID 16520)
-- Name: rocks rock_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rocks ALTER COLUMN rock_id SET DEFAULT nextval('public.rocks_rock_id_seq'::regclass);


--
-- TOC entry 3694 (class 2604 OID 16511)
-- Name: rocktypes rock_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rocktypes ALTER COLUMN rock_type_id SET DEFAULT nextval('public.rocktypes_rock_type_id_seq'::regclass);


--
-- TOC entry 3873 (class 0 OID 16555)
-- Dependencies: 227
-- Data for Name: borrowers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrowers (borrower_id, name, institution, email, join_date) FROM stdin;
3	Emily Chen	Detroit Geological Society	echen@dgs.org	2026-03-04
4	Louve Rhocks	Brown University	lrhocks@brown.edu	2026-03-07
7	Dr. James Patel	University of Michigan	jpatel@umich.edu	2026-03-10
8	Chris Redfield	BSAA	crfield@bsaa.gov	2026-03-10
9	Clive Rudd	MIT	CliveR@mit.edu	2026-03-10
\.


--
-- TOC entry 3875 (class 0 OID 16569)
-- Dependencies: 229
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (loan_id, rock_id, borrower_id, loan_date, due_date, return_date) FROM stdin;
7	8	3	2026-03-07	2026-03-15	\N
6	11	3	2026-03-04	2026-03-30	2026-03-07
11	24	4	2026-03-07	2026-05-02	\N
9	18	4	2026-03-07	2026-04-11	2026-03-07
13	25	9	2026-03-10	2026-03-31	\N
14	21	8	2026-03-10	2026-04-10	\N
\.


--
-- TOC entry 3870 (class 0 OID 16533)
-- Dependencies: 224
-- Data for Name: minerals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.minerals (mineral_id, name, chemical_formula) FROM stdin;
6	Quartz	SiO2
7	Feldspar	KAlSi3O8
8	Calcite	CaCO3
9	Mica	KAl2(AlSi3O10)(OH)2
10	Olivine	(Mg,Fe)2SiO4
11	Apatite	Ca10(PO4)6(OH,F,Cl)2
13	Kyanite	Al2SiO5
\.


--
-- TOC entry 3871 (class 0 OID 16541)
-- Dependencies: 225
-- Data for Name: rockminerals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rockminerals (rock_id, mineral_id) FROM stdin;
7	6
7	7
7	9
8	10
8	7
11	8
26	9
\.


--
-- TOC entry 3868 (class 0 OID 16517)
-- Dependencies: 222
-- Data for Name: rocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rocks (rock_id, name, rock_type_id, texture, color) FROM stdin;
7	Granite	4	Coarse-grained	Pink/Gray
8	Basalt	4	Fine-grained	Black
9	Sandstone	5	Clastic	Tan
10	Limestone	5	Fine	White/Gray
11	Marble	6	Crystalline	White
12	Slate	6	Foliated	Dark Gray
18	Conglomerate	5	Clastic	Various
20	Diorite	4	Coarse-grained	Gray
21	Rhyolite	4	Fine-grained	Light Brown
23	Claystone	6	Very-fine-grained	Gray
24	Gabbro	4	Fine-grained	Black
25	Phyllite	6	Foliated	Gray
26	Schist	6	Shimmery	Black
\.


--
-- TOC entry 3866 (class 0 OID 16508)
-- Dependencies: 220
-- Data for Name: rocktypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rocktypes (rock_type_id, name, description) FROM stdin;
4	Igneous	Formed from cooled magma or lava
5	Sedimentary	Formed from compressed sediments
6	Metamorphic	Formed from rocks altered by heat and pressure
\.


--
-- TOC entry 3886 (class 0 OID 0)
-- Dependencies: 226
-- Name: borrowers_borrower_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrowers_borrower_id_seq', 9, true);


--
-- TOC entry 3887 (class 0 OID 0)
-- Dependencies: 228
-- Name: loans_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loans_loan_id_seq', 14, true);


--
-- TOC entry 3888 (class 0 OID 0)
-- Dependencies: 223
-- Name: minerals_mineral_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.minerals_mineral_id_seq', 13, true);


--
-- TOC entry 3889 (class 0 OID 0)
-- Dependencies: 221
-- Name: rocks_rock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rocks_rock_id_seq', 26, true);


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 219
-- Name: rocktypes_rock_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rocktypes_rock_type_id_seq', 6, true);


--
-- TOC entry 3708 (class 2606 OID 16567)
-- Name: borrowers borrowers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_email_key UNIQUE (email);


--
-- TOC entry 3710 (class 2606 OID 16565)
-- Name: borrowers borrowers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_pkey PRIMARY KEY (borrower_id);


--
-- TOC entry 3712 (class 2606 OID 16577)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (loan_id);


--
-- TOC entry 3706 (class 2606 OID 16540)
-- Name: minerals minerals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minerals
    ADD CONSTRAINT minerals_pkey PRIMARY KEY (mineral_id);


--
-- TOC entry 3704 (class 2606 OID 16526)
-- Name: rocks rocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rocks
    ADD CONSTRAINT rocks_pkey PRIMARY KEY (rock_id);


--
-- TOC entry 3702 (class 2606 OID 16515)
-- Name: rocktypes rocktypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rocktypes
    ADD CONSTRAINT rocktypes_pkey PRIMARY KEY (rock_type_id);


--
-- TOC entry 3716 (class 2606 OID 16583)
-- Name: loans loans_borrower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_borrower_id_fkey FOREIGN KEY (borrower_id) REFERENCES public.borrowers(borrower_id);


--
-- TOC entry 3717 (class 2606 OID 16578)
-- Name: loans loans_rock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_rock_id_fkey FOREIGN KEY (rock_id) REFERENCES public.rocks(rock_id);


--
-- TOC entry 3714 (class 2606 OID 16549)
-- Name: rockminerals rockminerals_mineral_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rockminerals
    ADD CONSTRAINT rockminerals_mineral_id_fkey FOREIGN KEY (mineral_id) REFERENCES public.minerals(mineral_id);


--
-- TOC entry 3715 (class 2606 OID 16544)
-- Name: rockminerals rockminerals_rock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rockminerals
    ADD CONSTRAINT rockminerals_rock_id_fkey FOREIGN KEY (rock_id) REFERENCES public.rocks(rock_id);


--
-- TOC entry 3713 (class 2606 OID 16527)
-- Name: rocks rocks_rock_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rocks
    ADD CONSTRAINT rocks_rock_type_id_fkey FOREIGN KEY (rock_type_id) REFERENCES public.rocktypes(rock_type_id);


-- Completed on 2026-03-11 10:05:09 EDT

--
-- PostgreSQL database dump complete
--

\unrestrict u1OCsZvbrhZ9DXEXbSEWhnnlli9gGRfbua8BsbDLNuO2YVPt3yNk1ZJQ2tiJ2jF

