--
-- PostgreSQL database dump
--

\restrict 3SDgcdfbVKbbMiCphLcflhtteaZZhyn4rsuTpfdCvMEDanIDifeXVZfQGepXDnO

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: admin_users; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.admin_users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    enabled boolean NOT NULL,
    password_hash character varying(100) NOT NULL,
    role character varying(30) NOT NULL,
    updated_at timestamp(6) without time zone,
    username character varying(50) NOT NULL
);


ALTER TABLE public.admin_users OWNER TO pitchlog;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.admin_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO pitchlog;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: batch_job_execution; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_job_execution (
    job_execution_id bigint NOT NULL,
    version bigint,
    job_instance_id bigint NOT NULL,
    create_time timestamp without time zone NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    status character varying(10),
    exit_code character varying(2500),
    exit_message character varying(2500),
    last_updated timestamp without time zone
);


ALTER TABLE public.batch_job_execution OWNER TO pitchlog;

--
-- Name: batch_job_execution_context; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_job_execution_context (
    job_execution_id bigint NOT NULL,
    short_context character varying(2500) NOT NULL,
    serialized_context text
);


ALTER TABLE public.batch_job_execution_context OWNER TO pitchlog;

--
-- Name: batch_job_execution_params; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_job_execution_params (
    job_execution_id bigint NOT NULL,
    parameter_name character varying(100) NOT NULL,
    parameter_type character varying(100) NOT NULL,
    parameter_value character varying(2500),
    identifying character(1) NOT NULL
);


ALTER TABLE public.batch_job_execution_params OWNER TO pitchlog;

--
-- Name: batch_job_execution_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.batch_job_execution_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batch_job_execution_seq OWNER TO pitchlog;

--
-- Name: batch_job_instance; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_job_instance (
    job_instance_id bigint NOT NULL,
    version bigint,
    job_name character varying(100) NOT NULL,
    job_key character varying(32) NOT NULL
);


ALTER TABLE public.batch_job_instance OWNER TO pitchlog;

--
-- Name: batch_job_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.batch_job_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batch_job_seq OWNER TO pitchlog;

--
-- Name: batch_step_execution; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_step_execution (
    step_execution_id bigint NOT NULL,
    version bigint NOT NULL,
    step_name character varying(100) NOT NULL,
    job_execution_id bigint NOT NULL,
    create_time timestamp without time zone NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    status character varying(10),
    commit_count bigint,
    read_count bigint,
    filter_count bigint,
    write_count bigint,
    read_skip_count bigint,
    write_skip_count bigint,
    process_skip_count bigint,
    rollback_count bigint,
    exit_code character varying(2500),
    exit_message character varying(2500),
    last_updated timestamp without time zone
);


ALTER TABLE public.batch_step_execution OWNER TO pitchlog;

--
-- Name: batch_step_execution_context; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.batch_step_execution_context (
    step_execution_id bigint NOT NULL,
    short_context character varying(2500) NOT NULL,
    serialized_context text
);


ALTER TABLE public.batch_step_execution_context OWNER TO pitchlog;

--
-- Name: batch_step_execution_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.batch_step_execution_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batch_step_execution_seq OWNER TO pitchlog;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.countries (
    team_api_id integer,
    created_at timestamp(6) without time zone,
    id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    code character varying(10) NOT NULL,
    group_name character varying(10),
    name character varying(100) NOT NULL,
    flag_url character varying(500)
);


ALTER TABLE public.countries OWNER TO pitchlog;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO pitchlog;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: match_lineup_entries; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.match_lineup_entries (
    id bigint NOT NULL,
    fixture_id integer NOT NULL,
    formation character varying(20),
    grid character varying(10),
    player_api_id integer NOT NULL,
    player_name character varying(100),
    player_number integer,
    pos character varying(3),
    is_substitute boolean NOT NULL,
    team_api_id integer NOT NULL,
    team_name character varying(100),
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.match_lineup_entries OWNER TO pitchlog;

--
-- Name: match_lineup_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.match_lineup_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.match_lineup_entries_id_seq OWNER TO pitchlog;

--
-- Name: match_lineup_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.match_lineup_entries_id_seq OWNED BY public.match_lineup_entries.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.matches (
    id bigint NOT NULL,
    away_goals integer,
    away_team_api_id integer,
    away_team_logo character varying(500),
    away_team_name character varying(100),
    elapsed integer,
    fixture_id integer NOT NULL,
    group_name character varying(50),
    home_goals integer,
    home_team_api_id integer,
    home_team_logo character varying(500),
    home_team_name character varying(100),
    match_date timestamp(6) without time zone,
    round character varying(100),
    status_long character varying(50),
    status_short character varying(10),
    updated_at timestamp(6) without time zone,
    venue_city character varying(100),
    venue_name character varying(100)
);


ALTER TABLE public.matches OWNER TO pitchlog;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.matches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO pitchlog;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: player_season_stats; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.player_season_stats (
    appearances integer,
    assists integer,
    goals integer,
    league_api_id integer NOT NULL,
    rating double precision,
    red_cards integer,
    season_year integer NOT NULL,
    team_api_id integer NOT NULL,
    yellow_cards integer,
    id bigint NOT NULL,
    player_id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    league_name character varying(100),
    team_name character varying(100)
);


ALTER TABLE public.player_season_stats OWNER TO pitchlog;

--
-- Name: player_season_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.player_season_stats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.player_season_stats_id_seq OWNER TO pitchlog;

--
-- Name: player_season_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.player_season_stats_id_seq OWNED BY public.player_season_stats.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.players (
    api_player_id integer NOT NULL,
    birth_date date,
    created_at timestamp(6) without time zone,
    id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    height character varying(20),
    weight character varying(20),
    first_name character varying(50),
    last_name character varying(50),
    name character varying(100) NOT NULL,
    nationality character varying(100),
    photo_url character varying(500)
);


ALTER TABLE public.players OWNER TO pitchlog;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO pitchlog;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: squad_entries; Type: TABLE; Schema: public; Owner: pitchlog
--

CREATE TABLE public.squad_entries (
    is_active boolean NOT NULL,
    jersey_number integer,
    country_id bigint NOT NULL,
    id bigint NOT NULL,
    player_id bigint NOT NULL,
    updated_at timestamp(6) without time zone,
    "position" character varying(20),
    CONSTRAINT squad_entries_position_check CHECK ((("position")::text = ANY ((ARRAY['GK'::character varying, 'DEF'::character varying, 'MID'::character varying, 'FWD'::character varying])::text[])))
);


ALTER TABLE public.squad_entries OWNER TO pitchlog;

--
-- Name: squad_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: pitchlog
--

CREATE SEQUENCE public.squad_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.squad_entries_id_seq OWNER TO pitchlog;

--
-- Name: squad_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pitchlog
--

ALTER SEQUENCE public.squad_entries_id_seq OWNED BY public.squad_entries.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: match_lineup_entries id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.match_lineup_entries ALTER COLUMN id SET DEFAULT nextval('public.match_lineup_entries_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: player_season_stats id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.player_season_stats ALTER COLUMN id SET DEFAULT nextval('public.player_season_stats_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: squad_entries id; Type: DEFAULT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.squad_entries ALTER COLUMN id SET DEFAULT nextval('public.squad_entries_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.admin_users (id, created_at, enabled, password_hash, role, updated_at, username) FROM stdin;
1	2026-05-29 22:33:07.9817	t	$2a$10$OIDf9M2N8dvCnj2vHAwXJuzqVw2Z22iajtvqNJGKyXUCxe8YMHERW	ADMIN	2026-05-29 22:33:07.996702	admin
\.


--
-- Data for Name: batch_job_execution; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_job_execution (job_execution_id, version, job_instance_id, create_time, start_time, end_time, status, exit_code, exit_message, last_updated) FROM stdin;
1	2	1	2026-05-26 21:33:14.611526	2026-05-26 21:33:14.63312	2026-05-26 21:33:15.836911	FAILED	FAILED	java.lang.NullPointerException\r\n\tat java.base/java.util.ImmutableCollections$ListN.indexOf(ImmutableCollections.java:723)\r\n\tat java.base/java.util.ImmutableCollections$AbstractImmutableList.contains(ImmutableCollections.java:331)\r\n\tat com.pitchlog.batch.step.FetchCountriesStep.lambda$step$0(FetchCountriesStep.java:97)\r\n\tat java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:178)\r\n\tat java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)\r\n\tat java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)\r\n\tat java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)\r\n\tat java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)\r\n\tat java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)\r\n\tat java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)\r\n\tat java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)\r\n\tat com.pitchlog.batch.step.FetchCountriesStep.lambda$step$2(FetchCountriesStep.java:98)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$ChunkTransactionCallback.doInTransaction(TaskletStep.java:388)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$ChunkTransactionCallback.doInTransaction(TaskletStep.java:312)\r\n\tat org.springframework.transaction.support.TransactionTemplate.execute(TransactionTemplate.java:140)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$2.doInChunkContext(TaskletStep.java:255)\r\n\tat org.springframework.batch.core.scope.context.StepContextRepeatCallback.doInIteration(StepContextRepeatCallback.java:82)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.getNextResult(RepeatTemplate.java:369)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.executeInternal(RepeatTemplate.java:206)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.iterate(RepeatTemplate.java:140)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep.doExecute(TaskletStep.java:240)\r\n\tat org.springframework.batch.core.step.AbstractStep.execute(AbstractStep.java:229)\r\n\tat org.springframework.batch.core.job.SimpleStepHandler.handleStep(SimpleStepHandler.java:153)\r\n\tat org.springframework.batch.core.job.AbstractJob.handleStep(AbstractJob.java:418)\r\n\tat org.springframework.batch.core.job.SimpleJob.doExecute(SimpleJob.java:132)\r\n\tat org.springframework.batch.core.job.AbstractJob.e	2026-05-26 21:33:15.836911
2	2	2	2026-05-26 21:37:21.121232	2026-05-26 21:37:21.142085	2026-05-26 21:37:22.276272	COMPLETED	COMPLETED		2026-05-26 21:37:22.276272
3	2	3	2026-05-26 21:41:09.128922	2026-05-26 21:41:09.152114	2026-05-26 21:41:10.328112	COMPLETED	COMPLETED		2026-05-26 21:41:10.328112
4	2	4	2026-05-26 21:43:29.550388	2026-05-26 21:43:29.569525	2026-05-26 21:43:30.752324	COMPLETED	COMPLETED		2026-05-26 21:43:30.752324
5	2	5	2026-05-26 21:46:46.069696	2026-05-26 21:46:46.093989	2026-05-26 21:46:47.28413	COMPLETED	COMPLETED		2026-05-26 21:46:47.28413
6	2	6	2026-05-26 21:48:19.5151	2026-05-26 21:48:19.5331	2026-05-26 21:48:20.686089	COMPLETED	COMPLETED		2026-05-26 21:48:20.686089
7	2	7	2026-05-26 21:48:57.648682	2026-05-26 21:48:57.665799	2026-05-26 21:48:58.81383	COMPLETED	COMPLETED		2026-05-26 21:48:58.81383
8	2	8	2026-05-26 21:50:16.125857	2026-05-26 21:50:16.144887	2026-05-26 21:50:17.288676	COMPLETED	COMPLETED		2026-05-26 21:50:17.288676
9	2	9	2026-05-26 21:53:47.617364	2026-05-26 21:53:47.641521	2026-05-26 21:53:48.875815	COMPLETED	COMPLETED		2026-05-26 21:53:48.875815
10	2	10	2026-05-26 22:02:11.850245	2026-05-26 22:02:11.867862	2026-05-26 22:02:13.065169	COMPLETED	COMPLETED		2026-05-26 22:02:13.065697
11	2	11	2026-05-26 22:09:36.944459	2026-05-26 22:09:36.963644	2026-05-26 22:09:38.131953	COMPLETED	COMPLETED		2026-05-26 22:09:38.131953
12	2	12	2026-05-26 22:21:06.552129	2026-05-26 22:21:06.570277	2026-05-26 22:21:11.633483	FAILED	FAILED	org.springframework.web.reactive.function.client.WebClientResponseException$TooManyRequests: 429 Too Many Requests from GET https://v3.football.api-sports.io/players/squads\r\n\tat org.springframework.web.reactive.function.client.WebClientResponseException.create(WebClientResponseException.java:316)\r\n\tSuppressed: The stacktrace has been enhanced by Reactor, refer to additional information below: \r\nError has been observed at the following site(s):\r\n\t*__checkpoint ⇢ 429 TOO_MANY_REQUESTS from GET https://v3.football.api-sports.io/players/squads [DefaultWebClient]\r\nOriginal Stack Trace:\r\n\t\tat org.springframework.web.reactive.function.client.WebClientResponseException.create(WebClientResponseException.java:316)\r\n\t\tat org.springframework.web.reactive.function.client.DefaultClientResponse.lambda$createException$1(DefaultClientResponse.java:214)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onNext(FluxMap.java:106)\r\n\t\tat reactor.core.publisher.FluxOnErrorReturn$ReturnSubscriber.onNext(FluxOnErrorReturn.java:162)\r\n\t\tat reactor.core.publisher.FluxDefaultIfEmpty$DefaultIfEmptySubscriber.onNext(FluxDefaultIfEmpty.java:122)\r\n\t\tat reactor.core.publisher.FluxMapFuseable$MapFuseableSubscriber.onNext(FluxMapFuseable.java:129)\r\n\t\tat reactor.core.publisher.FluxContextWrite$ContextWriteSubscriber.onNext(FluxContextWrite.java:107)\r\n\t\tat reactor.core.publisher.FluxMapFuseable$MapFuseableConditionalSubscriber.onNext(FluxMapFuseable.java:299)\r\n\t\tat reactor.core.publisher.FluxFilterFuseable$FilterFuseableConditionalSubscriber.onNext(FluxFilterFuseable.java:337)\r\n\t\tat reactor.core.publisher.Operators$BaseFluxToMonoOperator.completePossiblyEmpty(Operators.java:2097)\r\n\t\tat reactor.core.publisher.MonoCollect$CollectSubscriber.onComplete(MonoCollect.java:145)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onComplete(FluxMap.java:144)\r\n\t\tat reactor.core.publisher.FluxPeek$PeekSubscriber.onComplete(FluxPeek.java:260)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onComplete(FluxMap.java:144)\r\n\t\tat reactor.netty.channel.FluxReceive.onInboundComplete(FluxReceive.java:415)\r\n\t\tat reactor.netty.channel.ChannelOperations.onInboundComplete(ChannelOperations.java:446)\r\n\t\tat reactor.netty.channel.ChannelOperations.terminate(ChannelOperations.java:500)\r\n\t\tat reactor.netty.http.client.HttpClientOperations.onInboundNext(HttpClientOperations.java:793)\r\n\t\tat reactor.netty.channel.ChannelOperationsHandler.channelRead(ChannelOperationsHandler.java:114)\r\n\t\tat io.netty.channel.AbstractChannelHa	2026-05-26 22:21:11.633483
13	1	13	2026-05-26 22:23:17.868586	2026-05-26 22:23:17.888305	\N	STARTED	UNKNOWN		2026-05-26 22:23:17.889308
\.


--
-- Data for Name: batch_job_execution_context; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_job_execution_context (job_execution_id, short_context, serialized_context) FROM stdin;
1	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
11	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
2	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
12	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
3	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
4	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
13	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
5	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
6	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
7	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
8	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
9	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
10	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAANYmF0Y2gudmVyc2lvbnQABTUuMS4xeA==	\N
\.


--
-- Data for Name: batch_job_execution_params; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_job_execution_params (job_execution_id, parameter_name, parameter_type, parameter_value, identifying) FROM stdin;
1	startedAt	java.lang.Long	1779798794592	Y
2	startedAt	java.lang.Long	1779799041105	Y
3	startedAt	java.lang.Long	1779799269099	Y
4	startedAt	java.lang.Long	1779799409523	Y
5	startedAt	java.lang.Long	1779799606033	Y
6	startedAt	java.lang.Long	1779799699491	Y
7	startedAt	java.lang.Long	1779799737622	Y
8	startedAt	java.lang.Long	1779799816099	Y
9	startedAt	java.lang.Long	1779800027589	Y
10	startedAt	java.lang.Long	1779800531823	Y
11	startedAt	java.lang.Long	1779800976915	Y
12	startedAt	java.lang.Long	1779801666525	Y
13	startedAt	java.lang.Long	1779801797839	Y
\.


--
-- Data for Name: batch_job_instance; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_job_instance (job_instance_id, version, job_name, job_key) FROM stdin;
1	0	syncWorldCupPlayersJob	10ec17fb2d48330c706fe1155c07e754
2	0	syncWorldCupPlayersJob	cf3af3b84b752ace253586ce225bf31e
3	0	syncWorldCupPlayersJob	7d40f6af60ba78e0266de84cdce43e78
4	0	syncWorldCupPlayersJob	9207776ec8682ec278446c9b2fae5d19
5	0	syncWorldCupPlayersJob	016df38d277089a8ff53e77c0586ffdd
6	0	syncWorldCupPlayersJob	8fdbe97d59501ea5326a6a309b7ee4f7
7	0	syncWorldCupPlayersJob	cdd4578c8fdd11c6cf8ab13d9e52d8fe
8	0	syncWorldCupPlayersJob	c29ea933e83f0cfe10fba5fbc1c8b979
9	0	syncWorldCupPlayersJob	555d0cda15cf323b62724617db400643
10	0	syncWorldCupPlayersJob	b03f0ff4ebd5e946e78f711be2ac3eaa
11	0	syncWorldCupPlayersJob	124d24c1af25574807b34d8d0f827afa
12	0	syncWorldCupPlayersJob	11f9902213b5bd88d0e1a2a173aeedc5
13	0	syncWorldCupPlayersJob	cd688566050765a7e15e804caccb9841
\.


--
-- Data for Name: batch_step_execution; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_step_execution (step_execution_id, version, step_name, job_execution_id, create_time, start_time, end_time, status, commit_count, read_count, filter_count, write_count, read_skip_count, write_skip_count, process_skip_count, rollback_count, exit_code, exit_message, last_updated) FROM stdin;
9	3	fetchSquadsStep	4	2026-05-26 21:43:30.621453	2026-05-26 21:43:30.625639	2026-05-26 21:43:30.70489	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:43:30.705414
1	2	fetchCountriesStep	1	2026-05-26 21:33:14.645671	2026-05-26 21:33:14.651016	2026-05-26 21:33:15.830136	FAILED	0	0	0	0	0	0	0	1	FAILED	java.lang.NullPointerException\r\n\tat java.base/java.util.ImmutableCollections$ListN.indexOf(ImmutableCollections.java:723)\r\n\tat java.base/java.util.ImmutableCollections$AbstractImmutableList.contains(ImmutableCollections.java:331)\r\n\tat com.pitchlog.batch.step.FetchCountriesStep.lambda$step$0(FetchCountriesStep.java:97)\r\n\tat java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:178)\r\n\tat java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)\r\n\tat java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)\r\n\tat java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)\r\n\tat java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:151)\r\n\tat java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:174)\r\n\tat java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)\r\n\tat java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)\r\n\tat com.pitchlog.batch.step.FetchCountriesStep.lambda$step$2(FetchCountriesStep.java:98)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$ChunkTransactionCallback.doInTransaction(TaskletStep.java:388)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$ChunkTransactionCallback.doInTransaction(TaskletStep.java:312)\r\n\tat org.springframework.transaction.support.TransactionTemplate.execute(TransactionTemplate.java:140)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep$2.doInChunkContext(TaskletStep.java:255)\r\n\tat org.springframework.batch.core.scope.context.StepContextRepeatCallback.doInIteration(StepContextRepeatCallback.java:82)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.getNextResult(RepeatTemplate.java:369)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.executeInternal(RepeatTemplate.java:206)\r\n\tat org.springframework.batch.repeat.support.RepeatTemplate.iterate(RepeatTemplate.java:140)\r\n\tat org.springframework.batch.core.step.tasklet.TaskletStep.doExecute(TaskletStep.java:240)\r\n\tat org.springframework.batch.core.step.AbstractStep.execute(AbstractStep.java:229)\r\n\tat org.springframework.batch.core.job.SimpleStepHandler.handleStep(SimpleStepHandler.java:153)\r\n\tat org.springframework.batch.core.job.AbstractJob.handleStep(AbstractJob.java:418)\r\n\tat org.springframework.batch.core.job.SimpleJob.doExecute(SimpleJob.java:132)\r\n\tat org.springframework.batch.core.job.AbstractJob.e	2026-05-26 21:33:15.830136
2	3	fetchCountriesStep	2	2026-05-26 21:37:21.154753	2026-05-26 21:37:21.159753	2026-05-26 21:37:22.224802	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:37:22.225326
23	3	fetchCountriesStep	9	2026-05-26 21:53:47.653314	2026-05-26 21:53:47.657996	2026-05-26 21:53:48.732335	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:53:48.732353
10	3	fetchPlayerStatsStep	4	2026-05-26 21:43:30.712882	2026-05-26 21:43:30.716547	2026-05-26 21:43:30.746324	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:43:30.746324
3	3	fetchSquadsStep	2	2026-05-26 21:37:22.233403	2026-05-26 21:37:22.237035	2026-05-26 21:37:22.249093	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:37:22.250093
20	3	fetchCountriesStep	8	2026-05-26 21:50:16.155503	2026-05-26 21:50:16.159504	2026-05-26 21:50:17.15899	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:50:17.15899
4	3	fetchPlayerStatsStep	2	2026-05-26 21:37:22.256804	2026-05-26 21:37:22.260038	2026-05-26 21:37:22.270476	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:37:22.270476
16	3	fetchPlayerStatsStep	6	2026-05-26 21:48:20.649026	2026-05-26 21:48:20.652159	2026-05-26 21:48:20.679766	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:20.680285
11	3	fetchCountriesStep	5	2026-05-26 21:46:46.107052	2026-05-26 21:46:46.111623	2026-05-26 21:46:47.132663	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:46:47.13319
5	3	fetchCountriesStep	3	2026-05-26 21:41:09.164972	2026-05-26 21:41:09.170782	2026-05-26 21:41:10.189958	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:41:10.189958
6	3	fetchSquadsStep	3	2026-05-26 21:41:10.197935	2026-05-26 21:41:10.201628	2026-05-26 21:41:10.283366	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:41:10.283366
12	3	fetchSquadsStep	5	2026-05-26 21:46:47.140605	2026-05-26 21:46:47.144261	2026-05-26 21:46:47.236381	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:46:47.236381
7	3	fetchPlayerStatsStep	3	2026-05-26 21:41:10.290808	2026-05-26 21:41:10.293946	2026-05-26 21:41:10.321949	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:41:10.322472
8	3	fetchCountriesStep	4	2026-05-26 21:43:29.58211	2026-05-26 21:43:29.586856	2026-05-26 21:43:30.611816	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:43:30.612342
17	3	fetchCountriesStep	7	2026-05-26 21:48:57.676599	2026-05-26 21:48:57.680782	2026-05-26 21:48:58.682267	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:58.682797
13	3	fetchPlayerStatsStep	5	2026-05-26 21:46:47.24384	2026-05-26 21:46:47.248027	2026-05-26 21:46:47.277268	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:46:47.277805
21	3	fetchSquadsStep	8	2026-05-26 21:50:17.16639	2026-05-26 21:50:17.169517	2026-05-26 21:50:17.244288	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:50:17.244288
14	3	fetchCountriesStep	6	2026-05-26 21:48:19.543426	2026-05-26 21:48:19.547567	2026-05-26 21:48:20.54547	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:20.545992
18	3	fetchSquadsStep	7	2026-05-26 21:48:58.690293	2026-05-26 21:48:58.69397	2026-05-26 21:48:58.768627	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:58.768627
15	3	fetchSquadsStep	6	2026-05-26 21:48:20.552726	2026-05-26 21:48:20.556345	2026-05-26 21:48:20.641656	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:20.641656
19	3	fetchPlayerStatsStep	7	2026-05-26 21:48:58.775472	2026-05-26 21:48:58.779157	2026-05-26 21:48:58.807428	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:48:58.807956
24	3	fetchSquadsStep	9	2026-05-26 21:53:48.73971	2026-05-26 21:53:48.743744	2026-05-26 21:53:48.825269	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:53:48.825269
22	3	fetchPlayerStatsStep	8	2026-05-26 21:50:17.252097	2026-05-26 21:50:17.255205	2026-05-26 21:50:17.282169	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:50:17.28218
26	3	fetchCountriesStep	10	2026-05-26 22:02:11.878733	2026-05-26 22:02:11.882368	2026-05-26 22:02:12.928886	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:02:12.929406
29	3	fetchCountriesStep	11	2026-05-26 22:09:36.974293	2026-05-26 22:09:36.978496	2026-05-26 22:09:38.001583	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:09:38.002112
25	3	fetchPlayerStatsStep	9	2026-05-26 21:53:48.832601	2026-05-26 21:53:48.836949	2026-05-26 21:53:48.868478	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 21:53:48.869006
28	3	fetchPlayerStatsStep	10	2026-05-26 22:02:13.025752	2026-05-26 22:02:13.029386	2026-05-26 22:02:13.059345	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:02:13.059345
27	3	fetchSquadsStep	10	2026-05-26 22:02:12.936827	2026-05-26 22:02:12.940226	2026-05-26 22:02:13.01779	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:02:13.01779
31	3	fetchPlayerStatsStep	11	2026-05-26 22:09:38.094163	2026-05-26 22:09:38.097899	2026-05-26 22:09:38.125544	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:09:38.126072
30	3	fetchSquadsStep	11	2026-05-26 22:09:38.009534	2026-05-26 22:09:38.012705	2026-05-26 22:09:38.086797	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:09:38.086808
32	3	fetchCountriesStep	12	2026-05-26 22:21:06.580767	2026-05-26 22:21:06.584408	2026-05-26 22:21:07.806429	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:21:07.806956
33	3	fetchSquadsStep	12	2026-05-26 22:21:07.823337	2026-05-26 22:21:07.827656	2026-05-26 22:21:11.62597	FAILED	1	10	0	5	0	0	0	1	FAILED	org.springframework.web.reactive.function.client.WebClientResponseException$TooManyRequests: 429 Too Many Requests from GET https://v3.football.api-sports.io/players/squads\r\n\tat org.springframework.web.reactive.function.client.WebClientResponseException.create(WebClientResponseException.java:316)\r\n\tSuppressed: The stacktrace has been enhanced by Reactor, refer to additional information below: \r\nError has been observed at the following site(s):\r\n\t*__checkpoint ⇢ 429 TOO_MANY_REQUESTS from GET https://v3.football.api-sports.io/players/squads [DefaultWebClient]\r\nOriginal Stack Trace:\r\n\t\tat org.springframework.web.reactive.function.client.WebClientResponseException.create(WebClientResponseException.java:316)\r\n\t\tat org.springframework.web.reactive.function.client.DefaultClientResponse.lambda$createException$1(DefaultClientResponse.java:214)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onNext(FluxMap.java:106)\r\n\t\tat reactor.core.publisher.FluxOnErrorReturn$ReturnSubscriber.onNext(FluxOnErrorReturn.java:162)\r\n\t\tat reactor.core.publisher.FluxDefaultIfEmpty$DefaultIfEmptySubscriber.onNext(FluxDefaultIfEmpty.java:122)\r\n\t\tat reactor.core.publisher.FluxMapFuseable$MapFuseableSubscriber.onNext(FluxMapFuseable.java:129)\r\n\t\tat reactor.core.publisher.FluxContextWrite$ContextWriteSubscriber.onNext(FluxContextWrite.java:107)\r\n\t\tat reactor.core.publisher.FluxMapFuseable$MapFuseableConditionalSubscriber.onNext(FluxMapFuseable.java:299)\r\n\t\tat reactor.core.publisher.FluxFilterFuseable$FilterFuseableConditionalSubscriber.onNext(FluxFilterFuseable.java:337)\r\n\t\tat reactor.core.publisher.Operators$BaseFluxToMonoOperator.completePossiblyEmpty(Operators.java:2097)\r\n\t\tat reactor.core.publisher.MonoCollect$CollectSubscriber.onComplete(MonoCollect.java:145)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onComplete(FluxMap.java:144)\r\n\t\tat reactor.core.publisher.FluxPeek$PeekSubscriber.onComplete(FluxPeek.java:260)\r\n\t\tat reactor.core.publisher.FluxMap$MapSubscriber.onComplete(FluxMap.java:144)\r\n\t\tat reactor.netty.channel.FluxReceive.onInboundComplete(FluxReceive.java:415)\r\n\t\tat reactor.netty.channel.ChannelOperations.onInboundComplete(ChannelOperations.java:446)\r\n\t\tat reactor.netty.channel.ChannelOperations.terminate(ChannelOperations.java:500)\r\n\t\tat reactor.netty.http.client.HttpClientOperations.onInboundNext(HttpClientOperations.java:793)\r\n\t\tat reactor.netty.channel.ChannelOperationsHandler.channelRead(ChannelOperationsHandler.java:114)\r\n\t\tat io.netty.channel.AbstractChannelHa	2026-05-26 22:21:11.62649
34	3	fetchCountriesStep	13	2026-05-26 22:23:17.900644	2026-05-26 22:23:17.904822	2026-05-26 22:23:19.186949	COMPLETED	1	0	0	0	0	0	0	0	COMPLETED		2026-05-26 22:23:19.187474
35	9	fetchSquadsStep	13	2026-05-26 22:23:19.198637	2026-05-26 22:23:19.204554	2026-05-26 22:26:46.258599	COMPLETED	7	32	0	32	0	0	0	0	COMPLETED		2026-05-26 22:26:46.258599
36	2	fetchPlayerStatsStep	13	2026-05-26 22:26:46.2716	2026-05-26 22:26:46.276598	\N	STARTED	1	50	50	0	0	0	0	0	EXECUTING		2026-05-26 22:32:01.56448
\.


--
-- Data for Name: batch_step_execution_context; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.batch_step_execution_context (step_execution_id, short_context, serialized_context) FROM stdin;
10	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
1	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjM4NDNhNjNiYjB0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
7	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
2	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjkxOGVhNjc2ZTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
17	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjA0MDFhNjc2ZTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
3	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
13	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
8	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjFiMDlhNjZhMTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
4	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
11	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMTNhNWVhNjY4Mjh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
5	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMWFjYTNhNjg0NzB0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
9	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
6	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
16	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
15	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
12	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
14	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjhmNDFhNjdjMDB0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
18	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
19	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
25	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
20	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMjBhZTRhNjc1MTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
29	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMWQyNjhhNjViZTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
21	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
26	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMWE5NDhhNjc5ZjB0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
22	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
35	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
23	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMWRkODFhNjZiZjh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
27	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
24	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
32	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMWUyMDFhNmMwMDB0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
30	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
28	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
34	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AEVjb20ucGl0Y2hsb2cuYmF0Y2guc3RlcC5GZXRjaENvdW50cmllc1N0ZXAkJExhbWJkYS8weDAwMDAwMTFlMGRhNWY5NTh0AA1iYXRjaC52ZXJzaW9udAAFNS4xLjF0AA5iYXRjaC5zdGVwVHlwZXQAN29yZy5zcHJpbmdmcmFtZXdvcmsuYmF0Y2guY29yZS5zdGVwLnRhc2tsZXQuVGFza2xldFN0ZXB4	\N
31	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
33	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
36	rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAARYmF0Y2gudGFza2xldFR5cGV0AD1vcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC5pdGVtLkNodW5rT3JpZW50ZWRUYXNrbGV0dAANYmF0Y2gudmVyc2lvbnQABTUuMS4xdAAOYmF0Y2guc3RlcFR5cGV0ADdvcmcuc3ByaW5nZnJhbWV3b3JrLmJhdGNoLmNvcmUuc3RlcC50YXNrbGV0LlRhc2tsZXRTdGVweA==	\N
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.countries (team_api_id, created_at, id, updated_at, code, group_name, name, flag_url) FROM stdin;
1	2026-05-26 22:23:19.030506	1	2026-05-26 22:23:19.039503	BEL	\N	Belgium	https://media.api-sports.io/football/teams/1.png
2	2026-05-26 22:23:19.062319	2	2026-05-26 22:23:19.062319	FRA	\N	France	https://media.api-sports.io/football/teams/2.png
3	2026-05-26 22:23:19.066537	3	2026-05-26 22:23:19.06706	CRO	\N	Croatia	https://media.api-sports.io/football/teams/3.png
6	2026-05-26 22:23:19.07021	4	2026-05-26 22:23:19.07021	BRA	\N	Brazil	https://media.api-sports.io/football/teams/6.png
7	2026-05-26 22:23:19.072832	5	2026-05-26 22:23:19.072832	URU	\N	Uruguay	https://media.api-sports.io/football/teams/7.png
9	2026-05-26 22:23:19.077696	6	2026-05-26 22:23:19.077695	SPA	\N	Spain	https://media.api-sports.io/football/teams/9.png
10	2026-05-26 22:23:19.08087	7	2026-05-26 22:23:19.080869	ENG	\N	England	https://media.api-sports.io/football/teams/10.png
12	2026-05-26 22:23:19.085069	8	2026-05-26 22:23:19.085068	JAP	\N	Japan	https://media.api-sports.io/football/teams/12.png
13	2026-05-26 22:23:19.088205	9	2026-05-26 22:23:19.088204	SEN	\N	Senegal	https://media.api-sports.io/football/teams/13.png
14	2026-05-26 22:23:19.094145	10	2026-05-26 22:23:19.094144	SER	\N	Serbia	https://media.api-sports.io/football/teams/14.png
15	2026-05-26 22:23:19.098365	11	2026-05-26 22:23:19.098365	SWI	\N	Switzerland	https://media.api-sports.io/football/teams/15.png
16	2026-05-26 22:23:19.101653	12	2026-05-26 22:23:19.102175	MEX	\N	Mexico	https://media.api-sports.io/football/teams/16.png
17	2026-05-26 22:23:19.106031	13	2026-05-26 22:23:19.106031	KOR	\N	South Korea	https://media.api-sports.io/football/teams/17.png
20	2026-05-26 22:23:19.109198	14	2026-05-26 22:23:19.109726	AUS	\N	Australia	https://media.api-sports.io/football/teams/20.png
21	2026-05-26 22:23:19.113924	15	2026-05-26 22:23:19.113923	DEN	\N	Denmark	https://media.api-sports.io/football/teams/21.png
22	2026-05-26 22:23:19.118114	16	2026-05-26 22:23:19.118619	IRA	\N	Iran	https://media.api-sports.io/football/teams/22.png
23	2026-05-26 22:23:19.122622	17	2026-05-26 22:23:19.122622	SAU	\N	Saudi Arabia	https://media.api-sports.io/football/teams/23.png
24	2026-05-26 22:23:19.126839	18	2026-05-26 22:23:19.126838	POL	\N	Poland	https://media.api-sports.io/football/teams/24.png
25	2026-05-26 22:23:19.130528	19	2026-05-26 22:23:19.130528	GER	\N	Germany	https://media.api-sports.io/football/teams/25.png
26	2026-05-26 22:23:19.134708	20	2026-05-26 22:23:19.134868	ARG	\N	Argentina	https://media.api-sports.io/football/teams/26.png
27	2026-05-26 22:23:19.138565	21	2026-05-26 22:23:19.138564	POR	\N	Portugal	https://media.api-sports.io/football/teams/27.png
28	2026-05-26 22:23:19.143143	22	2026-05-26 22:23:19.143143	TUN	\N	Tunisia	https://media.api-sports.io/football/teams/28.png
29	2026-05-26 22:23:19.147347	23	2026-05-26 22:23:19.147353	COS	\N	Costa Rica	https://media.api-sports.io/football/teams/29.png
31	2026-05-26 22:23:19.150624	24	2026-05-26 22:23:19.150624	MOR	\N	Morocco	https://media.api-sports.io/football/teams/31.png
767	2026-05-26 22:23:19.155368	25	2026-05-26 22:23:19.155368	WAL	\N	Wales	https://media.api-sports.io/football/teams/767.png
1118	2026-05-26 22:23:19.157978	26	2026-05-26 22:23:19.158495	NET	\N	Netherlands	https://media.api-sports.io/football/teams/1118.png
1504	2026-05-26 22:23:19.161837	27	2026-05-26 22:23:19.161837	GHA	\N	Ghana	https://media.api-sports.io/football/teams/1504.png
1530	2026-05-26 22:23:19.164448	28	2026-05-26 22:23:19.164447	CAM	\N	Cameroon	https://media.api-sports.io/football/teams/1530.png
1569	2026-05-26 22:23:19.168269	29	2026-05-26 22:23:19.168268	QAT	\N	Qatar	https://media.api-sports.io/football/teams/1569.png
2382	2026-05-26 22:23:19.170885	30	2026-05-26 22:23:19.170885	ECU	\N	Ecuador	https://media.api-sports.io/football/teams/2382.png
2384	2026-05-26 22:23:19.174055	31	2026-05-26 22:23:19.174055	USA	\N	USA	https://media.api-sports.io/football/teams/2384.png
5529	2026-05-26 22:23:19.176695	32	2026-05-26 22:23:19.177218	CAN	\N	Canada	https://media.api-sports.io/football/teams/5529.png
\.


--
-- Data for Name: match_lineup_entries; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.match_lineup_entries (id, fixture_id, formation, grid, player_api_id, player_name, player_number, pos, is_substitute, team_api_id, team_name, updated_at) FROM stdin;
1	1000000	\N	\N	173668	O. Knuuttila	1	\N	f	9177	NJS	2026-05-28 03:58:30.57799
2	1000000	\N	\N	263819	A. Hussein	29	\N	f	9177	NJS	2026-05-28 03:58:30.591427
3	1000000	\N	\N	336109	A. Liljaniemi	3	\N	f	9177	NJS	2026-05-28 03:58:30.593561
4	1000000	\N	\N	366257	D. Bäckström	33	\N	f	9177	NJS	2026-05-28 03:58:30.595132
5	1000000	\N	\N	236418	V. Salminen	18	\N	f	9177	NJS	2026-05-28 03:58:30.596711
6	1000000	\N	\N	366274	I. Sirkin	6	\N	f	9177	NJS	2026-05-28 03:58:30.598804
7	1000000	\N	\N	373683	V. Ketonen	28	\N	f	9177	NJS	2026-05-28 03:58:30.600387
8	1000000	\N	\N	173546	M. Salminen	8	\N	f	9177	NJS	2026-05-28 03:58:30.601437
9	1000000	\N	\N	336110	L. Pastinen	35	\N	f	9177	NJS	2026-05-28 03:58:30.603022
10	1000000	\N	\N	371253	K. Koivunen	2	\N	f	9177	NJS	2026-05-28 03:58:30.604614
11	1000000	\N	\N	417193	A. Aethe	7	\N	f	9177	NJS	2026-05-28 03:58:30.60567
12	1000000	\N	\N	417458	A. Kallio	26	\N	t	9177	NJS	2026-05-28 03:58:30.607401
13	1000000	\N	\N	410180	J. Rahja	27	\N	t	9177	NJS	2026-05-28 03:58:30.608468
14	1000000	\N	\N	366258	T. Grönthal	75	\N	t	9177	NJS	2026-05-28 03:58:30.61005
15	1000000	\N	\N	173596	M. Oinonen	22	\N	t	9177	NJS	2026-05-28 03:58:30.611643
16	1000000	\N	\N	417191	I. Kastrati	9	\N	t	9177	NJS	2026-05-28 03:58:30.612701
17	1000000	\N	\N	264420	R. Karvinen	12	\N	t	9177	NJS	2026-05-28 03:58:30.614284
18	1000000	\N	\N	419926	M. Inoranta	13	\N	t	9177	NJS	2026-05-28 03:58:30.615876
19	1000000	\N	\N	55514	Antonio Reguero	89	\N	f	2085	Klubi-04	2026-05-28 03:58:30.616923
20	1000000	\N	\N	361422	V. Vuorinen	91	\N	f	2085	Klubi-04	2026-05-28 03:58:30.618483
21	1000000	\N	\N	362304	N. Svensson	62	\N	f	2085	Klubi-04	2026-05-28 03:58:30.619551
22	1000000	\N	\N	313306	B. Dahlström	74	\N	f	2085	Klubi-04	2026-05-28 03:58:30.621119
23	1000000	\N	\N	316465	O. Häggström	75	\N	f	2085	Klubi-04	2026-05-28 03:58:30.622291
24	1000000	\N	\N	358422	M. Ritari	64	\N	f	2085	Klubi-04	2026-05-28 03:58:30.623884
25	1000000	\N	\N	383251	H. Noori	58	\N	f	2085	Klubi-04	2026-05-28 03:58:30.624954
26	1000000	\N	\N	340121	O. Hannula	49	\N	f	2085	Klubi-04	2026-05-28 03:58:30.626555
27	1000000	\N	\N	361379	D. Ezeh	73	\N	f	2085	Klubi-04	2026-05-28 03:58:30.627624
28	1000000	\N	\N	408724	S. Baranov	95	\N	f	2085	Klubi-04	2026-05-28 03:58:30.629203
29	1000000	\N	\N	302878	M. Boamah	97	\N	f	2085	Klubi-04	2026-05-28 03:58:30.630792
30	1000000	\N	\N	359670	J. Pikkuhookana	67	\N	t	2085	Klubi-04	2026-05-28 03:58:30.631858
31	1000000	\N	\N	342682	D. Hayes	87	\N	t	2085	Klubi-04	2026-05-28 03:58:30.633443
32	1000000	\N	\N	415678	L. Kuusisto	45	\N	t	2085	Klubi-04	2026-05-28 03:58:30.634485
33	1000000	\N	\N	365366	S. Silander	43	\N	t	2085	Klubi-04	2026-05-28 03:58:30.635536
34	1000000	\N	\N	358157	V. Blummé	63	\N	t	2085	Klubi-04	2026-05-28 03:58:30.637211
35	1000000	\N	\N	340219	A. Ramula	78	\N	t	2085	Klubi-04	2026-05-28 03:58:30.63881
36	1000000	\N	\N	340220	W. Grönblom	96	\N	t	2085	Klubi-04	2026-05-28 03:58:30.639876
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.matches (id, away_goals, away_team_api_id, away_team_logo, away_team_name, elapsed, fixture_id, group_name, home_goals, home_team_api_id, home_team_logo, home_team_name, match_date, round, status_long, status_short, updated_at, venue_city, venue_name) FROM stdin;
2	1	\N	https://media.api-sports.io/football/teams/17.png	South Korea	90	1000000	Group A	0	\N	https://media.api-sports.io/football/teams/16.png	Mexico	2026-06-10 03:36:00	Group Stage - 1	Match Finished	FT	2026-05-28 03:45:16.471641	Mexcico	stadium
\.


--
-- Data for Name: player_season_stats; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.player_season_stats (appearances, assists, goals, league_api_id, rating, red_cards, season_year, team_api_id, yellow_cards, id, player_id, updated_at, league_name, team_name) FROM stdin;
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.players (api_player_id, birth_date, created_at, id, updated_at, height, weight, first_name, last_name, name, nationality, photo_url) FROM stdin;
730	\N	2026-05-26 22:23:50.740185	1	2026-05-26 22:23:50.740184	\N	\N	\N	\N	T. Courtois	\N	https://media.api-sports.io/football/players/730.png
162511	\N	2026-05-26 22:23:50.752793	2	2026-05-26 22:23:50.752793	\N	\N	\N	\N	S. Lammens	\N	https://media.api-sports.io/football/players/162511.png
340151	\N	2026-05-26 22:23:50.760394	3	2026-05-26 22:23:50.760394	\N	\N	\N	\N	M. Penders	\N	https://media.api-sports.io/football/players/340151.png
2920	\N	2026-05-26 22:23:50.766119	4	2026-05-26 22:23:50.766119	\N	\N	\N	\N	T. Castagne	\N	https://media.api-sports.io/football/players/2920.png
162007	\N	2026-05-26 22:23:50.771315	5	2026-05-26 22:23:50.772312	\N	\N	\N	\N	M. De Cuyper	\N	https://media.api-sports.io/football/players/162007.png
162141	\N	2026-05-26 22:23:50.777313	6	2026-05-26 22:23:50.777312	\N	\N	\N	\N	K. De Winter	\N	https://media.api-sports.io/football/players/162141.png
304228	\N	2026-05-26 22:23:50.783967	7	2026-05-26 22:23:50.783967	\N	\N	\N	\N	Z. Debast	\N	https://media.api-sports.io/football/players/304228.png
69	\N	2026-05-26 22:23:50.79145	8	2026-05-26 22:23:50.791449	\N	\N	\N	\N	B. Mechele	\N	https://media.api-sports.io/football/players/69.png
264	\N	2026-05-26 22:23:50.798272	9	2026-05-26 22:23:50.798272	\N	\N	\N	\N	T. Meunier	\N	https://media.api-sports.io/football/players/264.png
312964	\N	2026-05-26 22:23:50.806083	10	2026-05-26 22:23:50.806608	\N	\N	\N	\N	N. Ngoy	\N	https://media.api-sports.io/football/players/312964.png
375974	\N	2026-05-26 22:23:50.814482	11	2026-05-26 22:23:50.814482	\N	\N	\N	\N	J. Seys	\N	https://media.api-sports.io/football/players/375974.png
204043	\N	2026-05-26 22:23:50.830657	12	2026-05-26 22:23:50.830656	\N	\N	\N	\N	A. Theate	\N	https://media.api-sports.io/football/players/204043.png
629	\N	2026-05-26 22:23:50.839047	13	2026-05-26 22:23:50.839047	\N	\N	\N	\N	K. De Bruyne	\N	https://media.api-sports.io/football/players/629.png
147859	\N	2026-05-26 22:23:50.848972	14	2026-05-26 22:23:50.848972	\N	\N	\N	\N	C. De Ketelaere	\N	https://media.api-sports.io/football/players/147859.png
335056	\N	2026-05-26 22:23:50.855825	15	2026-05-26 22:23:50.855824	\N	\N	\N	\N	Diego Moreira	\N	https://media.api-sports.io/football/players/335056.png
162714	\N	2026-05-26 22:23:50.862761	16	2026-05-26 22:23:50.86276	\N	\N	\N	\N	A. Onana	\N	https://media.api-sports.io/football/players/162714.png
2120	\N	2026-05-26 22:23:50.870142	17	2026-05-26 22:23:50.870142	\N	\N	\N	\N	N. Raskin	\N	https://media.api-sports.io/football/players/2120.png
1417	\N	2026-05-26 22:23:50.87709	18	2026-05-26 22:23:50.877089	\N	\N	\N	\N	A. Saelemaekers	\N	https://media.api-sports.io/football/players/1417.png
2926	\N	2026-05-26 22:23:50.884471	19	2026-05-26 22:23:50.88447	\N	\N	\N	\N	Y. Tielemans	\N	https://media.api-sports.io/football/players/2926.png
20	\N	2026-05-26 22:23:50.891077	20	2026-05-26 22:23:50.891076	\N	\N	\N	\N	A. Witsel	\N	https://media.api-sports.io/football/players/20.png
1422	\N	2026-05-26 22:23:50.897711	21	2026-05-26 22:23:50.89771	\N	\N	\N	\N	J. Doku	\N	https://media.api-sports.io/football/players/1422.png
340077	\N	2026-05-26 22:23:50.90349	22	2026-05-26 22:23:50.903489	\N	\N	\N	\N	M. Fernandez-Pardo	\N	https://media.api-sports.io/football/players/340077.png
907	\N	2026-05-26 22:23:50.909606	23	2026-05-26 22:23:50.909605	\N	\N	\N	\N	R. Lukaku	\N	https://media.api-sports.io/football/players/907.png
25458	\N	2026-05-26 22:23:50.914883	24	2026-05-26 22:23:50.914882	\N	\N	\N	\N	D. Lukebakio	\N	https://media.api-sports.io/football/players/25458.png
22221	\N	2026-05-26 22:23:50.919639	25	2026-05-26 22:23:50.920171	\N	\N	\N	\N	M. Maignan	\N	https://media.api-sports.io/football/players/22221.png
347211	\N	2026-05-26 22:23:50.926141	26	2026-05-26 22:23:50.926665	\N	\N	\N	\N	R. Risser	\N	https://media.api-sports.io/football/players/347211.png
21628	\N	2026-05-26 22:23:50.931929	27	2026-05-26 22:23:50.931928	\N	\N	\N	\N	B. Samba	\N	https://media.api-sports.io/football/players/21628.png
2724	\N	2026-05-26 22:23:50.937751	28	2026-05-26 22:23:50.937839	\N	\N	\N	\N	L. Digne	\N	https://media.api-sports.io/football/players/2724.png
161907	\N	2026-05-26 22:23:50.943685	29	2026-05-26 22:23:50.943684	\N	\N	\N	\N	M. Gusto	\N	https://media.api-sports.io/football/players/161907.png
33	\N	2026-05-26 22:23:50.94945	30	2026-05-26 22:23:50.94945	\N	\N	\N	\N	L. Hernández	\N	https://media.api-sports.io/football/players/33.png
47300	\N	2026-05-26 22:23:50.954837	31	2026-05-26 22:23:50.955368	\N	\N	\N	\N	T. Hernández	\N	https://media.api-sports.io/football/players/47300.png
1145	\N	2026-05-26 22:23:50.960859	32	2026-05-26 22:23:50.961378	\N	\N	\N	\N	I. Konaté	\N	https://media.api-sports.io/football/players/1145.png
20995	\N	2026-05-26 22:23:50.967707	33	2026-05-26 22:23:50.967706	\N	\N	\N	\N	M. Lacroix	\N	https://media.api-sports.io/football/players/20995.png
1149	\N	2026-05-26 22:23:50.973573	34	2026-05-26 22:23:50.973573	\N	\N	\N	\N	D. Upamecano	\N	https://media.api-sports.io/football/players/1149.png
156477	\N	2026-05-26 22:23:50.97935	35	2026-05-26 22:23:50.979349	\N	\N	\N	\N	R. Cherki	\N	https://media.api-sports.io/football/players/156477.png
2290	\N	2026-05-26 22:23:50.98524	36	2026-05-26 22:23:50.98524	\N	\N	\N	\N	N. Kanté	\N	https://media.api-sports.io/football/players/2290.png
22147	\N	2026-05-26 22:23:50.99156	37	2026-05-26 22:23:50.991559	\N	\N	\N	\N	M. Koné	\N	https://media.api-sports.io/football/players/22147.png
19617	\N	2026-05-26 22:23:50.998505	38	2026-05-26 22:23:50.998504	\N	\N	\N	\N	M. Olise	\N	https://media.api-sports.io/football/players/19617.png
272	\N	2026-05-26 22:23:51.008416	39	2026-05-26 22:23:51.008416	\N	\N	\N	\N	A. Rabiot	\N	https://media.api-sports.io/football/players/272.png
1271	\N	2026-05-26 22:23:51.020125	40	2026-05-26 22:23:51.020125	\N	\N	\N	\N	A. Tchouaméni	\N	https://media.api-sports.io/football/players/1271.png
336657	\N	2026-05-26 22:23:51.029649	41	2026-05-26 22:23:51.029649	\N	\N	\N	\N	W. Zaïre-Emery	\N	https://media.api-sports.io/football/players/336657.png
274300	\N	2026-05-26 22:23:51.039981	42	2026-05-26 22:23:51.03998	\N	\N	\N	\N	M. Akliouche	\N	https://media.api-sports.io/football/players/274300.png
153	\N	2026-05-26 22:23:51.049865	43	2026-05-26 22:23:51.050391	\N	\N	\N	\N	O. Dembélé	\N	https://media.api-sports.io/football/players/153.png
343027	\N	2026-05-26 22:23:51.060511	44	2026-05-26 22:23:51.06051	\N	\N	\N	\N	D. Doué	\N	https://media.api-sports.io/football/players/343027.png
278	\N	2026-05-26 22:23:51.074022	45	2026-05-26 22:23:51.074022	\N	\N	\N	\N	Kylian Mbappé	\N	https://media.api-sports.io/football/players/278.png
21509	\N	2026-05-26 22:23:51.089448	46	2026-05-26 22:23:51.089447	\N	\N	\N	\N	M. Thuram	\N	https://media.api-sports.io/football/players/21509.png
524	\N	2026-05-26 22:23:51.103489	47	2026-05-26 22:23:51.103489	\N	\N	\N	\N	D. Kotarski	\N	https://media.api-sports.io/football/players/524.png
1305	\N	2026-05-26 22:23:51.111489	48	2026-05-26 22:23:51.11249	\N	\N	\N	\N	D. Livaković	\N	https://media.api-sports.io/football/players/1305.png
14268	\N	2026-05-26 22:23:51.120491	49	2026-05-26 22:23:51.12049	\N	\N	\N	\N	I. Pandur	\N	https://media.api-sports.io/football/players/14268.png
1902	\N	2026-05-26 22:23:51.126491	50	2026-05-26 22:23:51.127491	\N	\N	\N	\N	D. Ćaleta-Car	\N	https://media.api-sports.io/football/players/1902.png
30827	\N	2026-05-26 22:23:51.132489	51	2026-05-26 22:23:51.132489	\N	\N	\N	\N	M. Erlić	\N	https://media.api-sports.io/football/players/30827.png
129033	\N	2026-05-26 22:23:51.137492	52	2026-05-26 22:23:51.138491	\N	\N	\N	\N	J. Gvardiol	\N	https://media.api-sports.io/football/players/129033.png
1084	\N	2026-05-26 22:23:51.14949	53	2026-05-26 22:23:51.14949	\N	\N	\N	\N	M. Pongračić	\N	https://media.api-sports.io/football/players/1084.png
125171	\N	2026-05-26 22:23:51.155491	54	2026-05-26 22:23:51.15549	\N	\N	\N	\N	J. Stanišić	\N	https://media.api-sports.io/football/players/125171.png
14701	\N	2026-05-26 22:23:51.162489	55	2026-05-26 22:23:51.162489	\N	\N	\N	\N	J. Šutalo	\N	https://media.api-sports.io/football/players/14701.png
387521	\N	2026-05-26 22:23:51.167492	56	2026-05-26 22:23:51.167491	\N	\N	\N	\N	L. Vušković	\N	https://media.api-sports.io/football/players/387521.png
295026	\N	2026-05-26 22:23:51.17349	57	2026-05-26 22:23:51.173489	\N	\N	\N	\N	M. Baturina	\N	https://media.api-sports.io/football/players/295026.png
284869	\N	2026-05-26 22:23:51.179489	58	2026-05-26 22:23:51.18049	\N	\N	\N	\N	T. Fruk	\N	https://media.api-sports.io/football/players/284869.png
14395	\N	2026-05-26 22:23:51.18549	59	2026-05-26 22:23:51.18549	\N	\N	\N	\N	K. Jakić	\N	https://media.api-sports.io/football/players/14395.png
2291	\N	2026-05-26 22:23:51.190489	60	2026-05-26 22:23:51.190489	\N	\N	\N	\N	M. Kovačić	\N	https://media.api-sports.io/football/players/2291.png
754	\N	2026-05-26 22:23:51.196491	61	2026-05-26 22:23:51.196491	\N	\N	\N	\N	L. Modrić	\N	https://media.api-sports.io/football/players/754.png
1322	\N	2026-05-26 22:23:51.201489	62	2026-05-26 22:23:51.201488	\N	\N	\N	\N	N. Moro	\N	https://media.api-sports.io/football/players/1322.png
2763	\N	2026-05-26 22:23:51.207489	63	2026-05-26 22:23:51.207489	\N	\N	\N	\N	M. Pašalić	\N	https://media.api-sports.io/football/players/2763.png
7332	\N	2026-05-26 22:23:51.21349	64	2026-05-26 22:23:51.21349	\N	\N	\N	\N	L. Sučić	\N	https://media.api-sports.io/football/players/7332.png
348205	\N	2026-05-26 22:23:51.21949	65	2026-05-26 22:23:51.21949	\N	\N	\N	\N	P. Sučić	\N	https://media.api-sports.io/football/players/348205.png
842	\N	2026-05-26 22:23:51.225489	66	2026-05-26 22:23:51.225488	\N	\N	\N	\N	N. Vlašić	\N	https://media.api-sports.io/football/players/842.png
46746	\N	2026-05-26 22:23:51.23149	67	2026-05-26 22:23:51.23149	\N	\N	\N	\N	A. Budimir	\N	https://media.api-sports.io/football/players/46746.png
726	\N	2026-05-26 22:23:51.241489	68	2026-05-26 22:23:51.241489	\N	\N	\N	\N	A. Kramarić	\N	https://media.api-sports.io/football/players/726.png
202696	\N	2026-05-26 22:23:51.250491	69	2026-05-26 22:23:51.25049	\N	\N	\N	\N	I. Matanović	\N	https://media.api-sports.io/football/players/202696.png
66055	\N	2026-05-26 22:23:51.259493	70	2026-05-26 22:23:51.259493	\N	\N	\N	\N	P. Musa	\N	https://media.api-sports.io/football/players/66055.png
260865	\N	2026-05-26 22:23:51.270489	71	2026-05-26 22:23:51.270489	\N	\N	\N	\N	M. Pašalić	\N	https://media.api-sports.io/football/players/260865.png
207	\N	2026-05-26 22:23:51.28049	72	2026-05-26 22:23:51.281489	\N	\N	\N	\N	I. Perišić	\N	https://media.api-sports.io/football/players/207.png
280	\N	2026-05-26 22:23:51.29249	73	2026-05-26 22:23:51.292489	\N	\N	\N	\N	Alisson Becker	\N	https://media.api-sports.io/football/players/280.png
617	\N	2026-05-26 22:23:51.303489	74	2026-05-26 22:23:51.303489	\N	\N	\N	\N	Ederson	\N	https://media.api-sports.io/football/players/617.png
2410	\N	2026-05-26 22:23:51.313491	75	2026-05-26 22:23:51.314489	\N	\N	\N	\N	Weverton	\N	https://media.api-sports.io/football/players/2410.png
30497	\N	2026-05-26 22:23:51.323253	76	2026-05-26 22:23:51.323779	\N	\N	\N	\N	Bremer	\N	https://media.api-sports.io/football/players/30497.png
618	\N	2026-05-26 22:23:51.332928	77	2026-05-26 22:23:51.333452	\N	\N	\N	\N	Danilo	\N	https://media.api-sports.io/football/players/618.png
22224	\N	2026-05-26 22:23:51.340297	78	2026-05-26 22:23:51.340297	\N	\N	\N	\N	Gabriel Magalhães	\N	https://media.api-sports.io/football/players/22224.png
30424	\N	2026-05-26 22:23:51.348856	79	2026-05-26 22:23:51.348855	\N	\N	\N	\N	Ibañez	\N	https://media.api-sports.io/football/players/30424.png
10124	\N	2026-05-26 22:23:51.356438	80	2026-05-26 22:23:51.356438	\N	\N	\N	\N	Léo Pereira	\N	https://media.api-sports.io/football/players/10124.png
257	\N	2026-05-26 22:23:51.363923	81	2026-05-26 22:23:51.363923	\N	\N	\N	\N	Marquinhos	\N	https://media.api-sports.io/football/players/257.png
24866	\N	2026-05-26 22:23:51.372788	82	2026-05-26 22:23:51.372788	\N	\N	\N	\N	Douglas Santos	\N	https://media.api-sports.io/football/players/24866.png
349001	\N	2026-05-26 22:23:51.380184	83	2026-05-26 22:23:51.380711	\N	\N	\N	\N	Wesley	\N	https://media.api-sports.io/football/players/349001.png
747	\N	2026-05-26 22:23:51.386503	84	2026-05-26 22:23:51.386502	\N	\N	\N	\N	Casemiro	\N	https://media.api-sports.io/football/players/747.png
275170	\N	2026-05-26 22:23:51.393981	85	2026-05-26 22:23:51.39398	\N	\N	\N	\N	Danilo	\N	https://media.api-sports.io/football/players/275170.png
299	\N	2026-05-26 22:23:51.399759	86	2026-05-26 22:23:51.399759	\N	\N	\N	\N	Fabinho	\N	https://media.api-sports.io/football/players/299.png
1165	\N	2026-05-26 22:23:51.405881	87	2026-05-26 22:23:51.40588	\N	\N	\N	\N	Matheus Cunha	\N	https://media.api-sports.io/football/players/1165.png
377122	\N	2026-05-26 22:23:51.41166	88	2026-05-26 22:23:51.411659	\N	\N	\N	\N	Endrick	\N	https://media.api-sports.io/football/players/377122.png
265785	\N	2026-05-26 22:23:51.419729	89	2026-05-26 22:23:51.419729	\N	\N	\N	\N	Luiz Henrique	\N	https://media.api-sports.io/football/players/265785.png
127769	\N	2026-05-26 22:23:51.425731	90	2026-05-26 22:23:51.425731	\N	\N	\N	\N	Gabriel Martinelli	\N	https://media.api-sports.io/football/players/127769.png
276	\N	2026-05-26 22:23:51.43155	91	2026-05-26 22:23:51.43155	\N	\N	\N	\N	Neymar	\N	https://media.api-sports.io/football/players/276.png
1496	\N	2026-05-26 22:23:51.438013	92	2026-05-26 22:23:51.438012	\N	\N	\N	\N	Raphinha	\N	https://media.api-sports.io/football/players/1496.png
407806	\N	2026-05-26 22:23:51.443531	93	2026-05-26 22:23:51.443531	\N	\N	\N	\N	Rayan	\N	https://media.api-sports.io/football/players/407806.png
196156	\N	2026-05-26 22:23:51.448915	94	2026-05-26 22:23:51.448914	\N	\N	\N	\N	Thiago	\N	https://media.api-sports.io/football/players/196156.png
762	\N	2026-05-26 22:23:51.454715	95	2026-05-26 22:23:51.454715	\N	\N	\N	\N	Vinícius Júnior	\N	https://media.api-sports.io/football/players/762.png
405124	\N	2026-05-26 22:23:51.460501	96	2026-05-26 22:23:51.4605	\N	\N	\N	\N	K. Martínez	\N	https://media.api-sports.io/football/players/405124.png
61895	\N	2026-05-26 22:23:51.466496	97	2026-05-26 22:23:51.466495	\N	\N	\N	\N	S. Mele	\N	https://media.api-sports.io/football/players/61895.png
429	\N	2026-05-26 22:23:51.471206	98	2026-05-26 22:23:51.471733	\N	\N	\N	\N	F. Muslera	\N	https://media.api-sports.io/football/players/429.png
50077	\N	2026-05-26 22:23:51.476047	99	2026-05-26 22:23:51.476046	\N	\N	\N	\N	S. Rochet	\N	https://media.api-sports.io/football/players/50077.png
101814	\N	2026-05-26 22:23:51.481435	100	2026-05-26 22:23:51.481435	\N	\N	\N	\N	R. Araújo	\N	https://media.api-sports.io/football/players/101814.png
135334	\N	2026-05-26 22:23:51.486711	101	2026-05-26 22:23:51.486711	\N	\N	\N	\N	S. Bueno	\N	https://media.api-sports.io/football/players/135334.png
51535	\N	2026-05-26 22:23:51.492962	102	2026-05-26 22:23:51.492961	\N	\N	\N	\N	S. Cáceres	\N	https://media.api-sports.io/football/players/51535.png
31	\N	2026-05-26 22:23:51.500479	103	2026-05-26 22:23:51.500479	\N	\N	\N	\N	J. Giménez	\N	https://media.api-sports.io/football/players/31.png
47254	\N	2026-05-26 22:23:51.505481	104	2026-05-26 22:23:51.505481	\N	\N	\N	\N	M. Olivera	\N	https://media.api-sports.io/football/players/47254.png
51466	\N	2026-05-26 22:23:51.51148	105	2026-05-26 22:23:51.51148	\N	\N	\N	\N	J. Piquerez	\N	https://media.api-sports.io/football/players/51466.png
51426	\N	2026-05-26 22:23:51.517479	106	2026-05-26 22:23:51.517478	\N	\N	\N	\N	J. Rodríguez	\N	https://media.api-sports.io/football/players/51426.png
1290	\N	2026-05-26 22:23:51.523479	107	2026-05-26 22:23:51.523478	\N	\N	\N	\N	G. Varela	\N	https://media.api-sports.io/football/players/1290.png
51572	\N	2026-05-26 22:23:51.53148	108	2026-05-26 22:23:51.53148	\N	\N	\N	\N	M. Viña	\N	https://media.api-sports.io/football/players/51572.png
30690	\N	2026-05-26 22:23:51.537481	109	2026-05-26 22:23:51.53748	\N	\N	\N	\N	N. Fonseca	\N	https://media.api-sports.io/football/players/30690.png
153083	\N	2026-05-26 22:23:51.543479	110	2026-05-26 22:23:51.543479	\N	\N	\N	\N	E. Martínez	\N	https://media.api-sports.io/football/players/153083.png
162891	\N	2026-05-26 22:23:51.551478	111	2026-05-26 22:23:51.551478	\N	\N	\N	\N	J. Sanabria	\N	https://media.api-sports.io/football/players/162891.png
51494	\N	2026-05-26 22:23:51.55748	112	2026-05-26 22:23:51.557479	\N	\N	\N	\N	M. Ugarte	\N	https://media.api-sports.io/football/players/51494.png
756	\N	2026-05-26 22:23:51.56448	113	2026-05-26 22:23:51.565478	\N	\N	\N	\N	F. Valverde	\N	https://media.api-sports.io/football/players/756.png
2612	\N	2026-05-26 22:23:51.571479	114	2026-05-26 22:23:51.571479	\N	\N	\N	\N	G. de Arrascaeta	\N	https://media.api-sports.io/football/players/2612.png
5995	\N	2026-05-26 22:23:51.578479	115	2026-05-26 22:23:51.578478	\N	\N	\N	\N	N. de la Cruz	\N	https://media.api-sports.io/football/players/5995.png
16482	\N	2026-05-26 22:23:51.584478	116	2026-05-26 22:23:51.584478	\N	\N	\N	\N	R. Aguirre	\N	https://media.api-sports.io/football/players/16482.png
278190	\N	2026-05-26 22:23:51.590479	117	2026-05-26 22:23:51.590478	\N	\N	\N	\N	A. Álvarez	\N	https://media.api-sports.io/football/players/278190.png
51776	\N	2026-05-26 22:23:51.596478	118	2026-05-26 22:23:51.596478	\N	\N	\N	\N	M. Araújo	\N	https://media.api-sports.io/football/players/51776.png
51603	\N	2026-05-26 22:23:51.60248	119	2026-05-26 22:23:51.60248	\N	\N	\N	\N	A. Canobbio	\N	https://media.api-sports.io/football/players/51603.png
51617	\N	2026-05-26 22:23:51.609479	120	2026-05-26 22:23:51.609478	\N	\N	\N	\N	D. Núñez	\N	https://media.api-sports.io/football/players/51617.png
70078	\N	2026-05-26 22:23:51.614478	121	2026-05-26 22:23:51.614477	\N	\N	\N	\N	F. Pellistri	\N	https://media.api-sports.io/football/players/70078.png
51618	\N	2026-05-26 22:23:51.620481	122	2026-05-26 22:23:51.62048	\N	\N	\N	\N	B. Rodríguez	\N	https://media.api-sports.io/football/players/51618.png
51620	\N	2026-05-26 22:23:51.626479	123	2026-05-26 22:23:51.626478	\N	\N	\N	\N	F. Torres	\N	https://media.api-sports.io/football/players/51620.png
51530	\N	2026-05-26 22:23:51.631478	124	2026-05-26 22:23:51.631477	\N	\N	\N	\N	F. Viñas	\N	https://media.api-sports.io/football/players/51530.png
182718	\N	2026-05-26 22:24:23.176187	125	2026-05-26 22:24:23.176714	\N	\N	\N	\N	Joan García	\N	https://media.api-sports.io/football/players/182718.png
19465	\N	2026-05-26 22:24:23.181425	126	2026-05-26 22:24:23.181445	\N	\N	\N	\N	David Raya	\N	https://media.api-sports.io/football/players/19465.png
47269	\N	2026-05-26 22:24:23.185792	127	2026-05-26 22:24:23.185792	\N	\N	\N	\N	Álex Remiro	\N	https://media.api-sports.io/football/players/47269.png
47270	\N	2026-05-26 22:24:23.191061	128	2026-05-26 22:24:23.19106	\N	\N	\N	\N	Unai Simón	\N	https://media.api-sports.io/football/players/47270.png
396623	\N	2026-05-26 22:24:23.196301	129	2026-05-26 22:24:23.196301	\N	\N	\N	\N	Pau Cubarsí Paredes	\N	https://media.api-sports.io/football/players/396623.png
47380	\N	2026-05-26 22:24:23.200486	130	2026-05-26 22:24:23.200485	\N	\N	\N	\N	Marc Cucurella	\N	https://media.api-sports.io/football/players/47380.png
563	\N	2026-05-26 22:24:23.207422	131	2026-05-26 22:24:23.207422	\N	\N	\N	\N	Álex Grimaldo	\N	https://media.api-sports.io/football/players/563.png
361497	\N	2026-05-26 22:24:23.212136	132	2026-05-26 22:24:23.212135	\N	\N	\N	\N	D. Huijsen	\N	https://media.api-sports.io/football/players/361497.png
622	\N	2026-05-26 22:24:23.218072	133	2026-05-26 22:24:23.218072	\N	\N	\N	\N	Aymeric Laporte	\N	https://media.api-sports.io/football/players/622.png
753	\N	2026-05-26 22:24:23.22386	134	2026-05-26 22:24:23.223859	\N	\N	\N	\N	Marcos Llorente	\N	https://media.api-sports.io/football/players/753.png
333682	\N	2026-05-26 22:24:23.229109	135	2026-05-26 22:24:23.229109	\N	\N	\N	\N	Cristhian Mosquera	\N	https://media.api-sports.io/football/players/333682.png
47519	\N	2026-05-26 22:24:23.2352	136	2026-05-26 22:24:23.235199	\N	\N	\N	\N	Pedro Porro	\N	https://media.api-sports.io/football/players/47519.png
336594	\N	2026-05-26 22:24:23.242071	137	2026-05-26 22:24:23.242071	\N	\N	\N	\N	Pablo Barrios	\N	https://media.api-sports.io/football/players/336594.png
340626	\N	2026-05-26 22:24:23.24856	138	2026-05-26 22:24:23.24856	\N	\N	\N	\N	Fermín	\N	https://media.api-sports.io/football/players/340626.png
1697	\N	2026-05-26 22:24:23.254807	139	2026-05-26 22:24:23.254807	\N	\N	\N	\N	Pablo Fornals	\N	https://media.api-sports.io/football/players/1697.png
1323	\N	2026-05-26 22:24:23.260059	140	2026-05-26 22:24:23.260059	\N	\N	\N	\N	Dani Olmo	\N	https://media.api-sports.io/football/players/1323.png
133609	\N	2026-05-26 22:24:23.265455	141	2026-05-26 22:24:23.265455	\N	\N	\N	\N	Pedri	\N	https://media.api-sports.io/football/players/133609.png
44	\N	2026-05-26 22:24:23.270175	142	2026-05-26 22:24:23.270175	\N	\N	\N	\N	Rodri	\N	https://media.api-sports.io/football/players/44.png
930	\N	2026-05-26 22:24:23.275716	143	2026-05-26 22:24:23.275716	\N	\N	\N	\N	Carlos Soler	\N	https://media.api-sports.io/football/players/930.png
47315	\N	2026-05-26 22:24:23.281097	144	2026-05-26 22:24:23.281622	\N	\N	\N	\N	Martín Zubimendi	\N	https://media.api-sports.io/football/players/47315.png
182219	\N	2026-05-26 22:24:23.287428	145	2026-05-26 22:24:23.287427	\N	\N	\N	\N	Álex Baena	\N	https://media.api-sports.io/football/players/182219.png
47317	\N	2026-05-26 22:24:23.294439	146	2026-05-26 22:24:23.294438	\N	\N	\N	\N	Barrenetxea	\N	https://media.api-sports.io/football/players/47317.png
47348	\N	2026-05-26 22:24:23.300618	147	2026-05-26 22:24:23.30114	\N	\N	\N	\N	Borja Iglesias	\N	https://media.api-sports.io/football/players/47348.png
386828	\N	2026-05-26 22:24:23.305879	148	2026-05-26 22:24:23.305879	\N	\N	\N	\N	Lamine Yamal	\N	https://media.api-sports.io/football/players/386828.png
338751	\N	2026-05-26 22:24:23.311752	149	2026-05-26 22:24:23.312275	\N	\N	\N	\N	Víctor Muñoz	\N	https://media.api-sports.io/football/players/338751.png
47323	\N	2026-05-26 22:24:23.317571	150	2026-05-26 22:24:23.317571	\N	\N	\N	\N	Mikel Oyarzabal	\N	https://media.api-sports.io/football/players/47323.png
184226	\N	2026-05-26 22:24:23.323357	151	2026-05-26 22:24:23.323356	\N	\N	\N	\N	Yeremy Pino	\N	https://media.api-sports.io/football/players/184226.png
358628	\N	2026-05-26 22:24:23.328123	152	2026-05-26 22:24:23.328123	\N	\N	\N	\N	Samu	\N	https://media.api-sports.io/football/players/358628.png
931	\N	2026-05-26 22:24:23.333037	153	2026-05-26 22:24:23.33356	\N	\N	\N	\N	Ferran Torres	\N	https://media.api-sports.io/football/players/931.png
19088	\N	2026-05-26 22:24:23.338806	154	2026-05-26 22:24:23.338805	\N	\N	\N	\N	D. Henderson	\N	https://media.api-sports.io/football/players/19088.png
2932	\N	2026-05-26 22:24:23.34705	155	2026-05-26 22:24:23.34705	\N	\N	\N	\N	J. Pickford	\N	https://media.api-sports.io/football/players/2932.png
20355	\N	2026-05-26 22:24:23.35421	156	2026-05-26 22:24:23.354329	\N	\N	\N	\N	A. Ramsdale	\N	https://media.api-sports.io/football/players/20355.png
18960	\N	2026-05-26 22:24:23.365803	157	2026-05-26 22:24:23.366332	\N	\N	\N	\N	J. Steele	\N	https://media.api-sports.io/football/players/18960.png
162489	\N	2026-05-26 22:24:23.374983	158	2026-05-26 22:24:23.374983	\N	\N	\N	\N	J. Trafford	\N	https://media.api-sports.io/football/players/162489.png
18961	\N	2026-05-26 22:24:23.382388	159	2026-05-26 22:24:23.382387	\N	\N	\N	\N	D. Burn	\N	https://media.api-sports.io/football/players/18961.png
67971	\N	2026-05-26 22:24:23.39161	160	2026-05-26 22:24:23.39161	\N	\N	\N	\N	M. Guéhi	\N	https://media.api-sports.io/football/players/67971.png
284492	\N	2026-05-26 22:24:23.401518	161	2026-05-26 22:24:23.401518	\N	\N	\N	\N	L. Hall	\N	https://media.api-sports.io/football/players/284492.png
19354	\N	2026-05-26 22:24:23.412518	162	2026-05-26 22:24:23.412518	\N	\N	\N	\N	E. Konsa	\N	https://media.api-sports.io/football/players/19354.png
158694	\N	2026-05-26 22:24:23.424519	163	2026-05-26 22:24:23.424518	\N	\N	\N	\N	T. Livramento	\N	https://media.api-sports.io/football/players/158694.png
2935	\N	2026-05-26 22:24:23.433518	164	2026-05-26 22:24:23.433517	\N	\N	\N	\N	H. Maguire	\N	https://media.api-sports.io/football/players/2935.png
19235	\N	2026-05-26 22:24:23.442518	165	2026-05-26 22:24:23.442518	\N	\N	\N	\N	D. Spence	\N	https://media.api-sports.io/football/players/19235.png
626	\N	2026-05-26 22:24:23.455252	166	2026-05-26 22:24:23.455252	\N	\N	\N	\N	J. Stones	\N	https://media.api-sports.io/football/players/626.png
19209	\N	2026-05-26 22:24:23.46311	167	2026-05-26 22:24:23.463109	\N	\N	\N	\N	F. Tomori	\N	https://media.api-sports.io/football/players/19209.png
19959	\N	2026-05-26 22:24:23.474504	168	2026-05-26 22:24:23.474503	\N	\N	\N	\N	B. White	\N	https://media.api-sports.io/football/players/19959.png
138908	\N	2026-05-26 22:24:23.481502	169	2026-05-26 22:24:23.481502	\N	\N	\N	\N	E. Anderson	\N	https://media.api-sports.io/football/players/138908.png
129718	\N	2026-05-26 22:24:23.493503	170	2026-05-26 22:24:23.493503	\N	\N	\N	\N	J. Bellingham	\N	https://media.api-sports.io/football/players/129718.png
631	\N	2026-05-26 22:24:23.503502	171	2026-05-26 22:24:23.504501	\N	\N	\N	\N	P. Foden	\N	https://media.api-sports.io/football/players/631.png
895	\N	2026-05-26 22:24:23.518503	172	2026-05-26 22:24:23.518503	\N	\N	\N	\N	J. Garner	\N	https://media.api-sports.io/football/players/895.png
292	\N	2026-05-26 22:24:23.526504	173	2026-05-26 22:24:23.526503	\N	\N	\N	\N	J. Henderson	\N	https://media.api-sports.io/football/players/292.png
284322	\N	2026-05-26 22:24:23.534502	174	2026-05-26 22:24:23.534501	\N	\N	\N	\N	K. Mainoo	\N	https://media.api-sports.io/football/players/284322.png
307123	\N	2026-05-26 22:24:23.541502	175	2026-05-26 22:24:23.541501	\N	\N	\N	\N	N. O&apos;Reilly	\N	https://media.api-sports.io/football/players/307123.png
152982	\N	2026-05-26 22:24:23.546504	176	2026-05-26 22:24:23.547502	\N	\N	\N	\N	C. Palmer	\N	https://media.api-sports.io/football/players/152982.png
19170	\N	2026-05-26 22:24:23.553505	177	2026-05-26 22:24:23.553504	\N	\N	\N	\N	M. Rogers	\N	https://media.api-sports.io/football/players/19170.png
288102	\N	2026-05-26 22:24:23.560504	178	2026-05-26 22:24:23.560503	\N	\N	\N	\N	A. Wharton	\N	https://media.api-sports.io/football/players/288102.png
18778	\N	2026-05-26 22:24:23.565502	179	2026-05-26 22:24:23.565502	\N	\N	\N	\N	H. Barnes	\N	https://media.api-sports.io/football/players/18778.png
19428	\N	2026-05-26 22:24:23.570502	180	2026-05-26 22:24:23.570501	\N	\N	\N	\N	J. Bowen	\N	https://media.api-sports.io/football/players/19428.png
18766	\N	2026-05-26 22:24:23.575502	181	2026-05-26 22:24:23.575501	\N	\N	\N	\N	D. Calvert-Lewin	\N	https://media.api-sports.io/football/players/18766.png
138787	\N	2026-05-26 22:24:23.580502	182	2026-05-26 22:24:23.580501	\N	\N	\N	\N	A. Gordon	\N	https://media.api-sports.io/football/players/138787.png
136723	\N	2026-05-26 22:24:23.585503	183	2026-05-26 22:24:23.585503	\N	\N	\N	\N	N. Madueke	\N	https://media.api-sports.io/football/players/136723.png
909	\N	2026-05-26 22:24:23.593503	184	2026-05-26 22:24:23.593502	\N	\N	\N	\N	M. Rashford	\N	https://media.api-sports.io/football/players/909.png
18883	\N	2026-05-26 22:24:23.600502	185	2026-05-26 22:24:23.600502	\N	\N	\N	\N	D. Solanke	\N	https://media.api-sports.io/football/players/18883.png
304782	\N	2026-05-26 22:24:23.607504	186	2026-05-26 22:24:23.607504	\N	\N	\N	\N	T. Hayakawa	\N	https://media.api-sports.io/football/players/304782.png
33034	\N	2026-05-26 22:24:23.616505	187	2026-05-26 22:24:23.616504	\N	\N	\N	\N	K. Osako	\N	https://media.api-sports.io/football/players/33034.png
199578	\N	2026-05-26 22:24:23.623503	188	2026-05-26 22:24:23.623503	\N	\N	\N	\N	Z. Suzuki	\N	https://media.api-sports.io/football/players/199578.png
32893	\N	2026-05-26 22:24:23.632503	189	2026-05-26 22:24:23.632502	\N	\N	\N	\N	H. Ito	\N	https://media.api-sports.io/football/players/32893.png
440	\N	2026-05-26 22:24:23.643503	190	2026-05-26 22:24:23.643502	\N	\N	\N	\N	Y. Nagatomo	\N	https://media.api-sports.io/football/players/440.png
33165	\N	2026-05-26 22:24:23.650503	191	2026-05-26 22:24:23.651504	\N	\N	\N	\N	A. Seko	\N	https://media.api-sports.io/football/players/33165.png
32887	\N	2026-05-26 22:24:23.660502	192	2026-05-26 22:24:23.661502	\N	\N	\N	\N	Y. Sugawara	\N	https://media.api-sports.io/football/players/32887.png
351014	\N	2026-05-26 22:24:23.670504	193	2026-05-26 22:24:23.670503	\N	\N	\N	\N	J. Suzuki	\N	https://media.api-sports.io/football/players/351014.png
32954	\N	2026-05-26 22:24:23.680502	194	2026-05-26 22:24:23.681504	\N	\N	\N	\N	S. Taniguchi	\N	https://media.api-sports.io/football/players/32954.png
2597	\N	2026-05-26 22:24:23.692276	195	2026-05-26 22:24:23.692275	\N	\N	\N	\N	T. Tomiyasu	\N	https://media.api-sports.io/football/players/2597.png
32858	\N	2026-05-26 22:24:23.70374	196	2026-05-26 22:24:23.704254	\N	\N	\N	\N	T. Watanabe	\N	https://media.api-sports.io/football/players/32858.png
2598	\N	2026-05-26 22:24:23.712529	197	2026-05-26 22:24:23.712528	\N	\N	\N	\N	R. Dōan	\N	https://media.api-sports.io/football/players/2598.png
2601	\N	2026-05-26 22:24:23.722527	198	2026-05-26 22:24:23.722527	\N	\N	\N	\N	D. Kamada	\N	https://media.api-sports.io/football/players/2601.png
33889	\N	2026-05-26 22:24:23.731527	199	2026-05-26 22:24:23.731527	\N	\N	\N	\N	K. Sano	\N	https://media.api-sports.io/football/players/33889.png
33142	\N	2026-05-26 22:24:23.737529	200	2026-05-26 22:24:23.737528	\N	\N	\N	\N	S. Tanaka	\N	https://media.api-sports.io/football/players/33142.png
375930	\N	2026-05-26 22:24:23.745527	201	2026-05-26 22:24:23.745527	\N	\N	\N	\N	K. Goto	\N	https://media.api-sports.io/football/players/375930.png
1942	\N	2026-05-26 22:24:23.751529	202	2026-05-26 22:24:23.751529	\N	\N	\N	\N	J. Ito	\N	https://media.api-sports.io/football/players/1942.png
33224	\N	2026-05-26 22:24:23.759528	203	2026-05-26 22:24:23.759528	\N	\N	\N	\N	D. Maeda	\N	https://media.api-sports.io/football/players/33224.png
33321	\N	2026-05-26 22:24:23.767528	204	2026-05-26 22:24:23.767528	\N	\N	\N	\N	Keito Nakamura	\N	https://media.api-sports.io/football/players/33321.png
33289	\N	2026-05-26 22:24:23.773528	205	2026-05-26 22:24:23.773527	\N	\N	\N	\N	Koki Ogawa	\N	https://media.api-sports.io/football/players/33289.png
422572	\N	2026-05-26 22:24:23.779527	206	2026-05-26 22:24:23.779526	\N	\N	\N	\N	K. Shiogai	\N	https://media.api-sports.io/football/players/422572.png
199143	\N	2026-05-26 22:24:23.784527	207	2026-05-26 22:24:23.784526	\N	\N	\N	\N	Y. Suzuki	\N	https://media.api-sports.io/football/players/199143.png
72155	\N	2026-05-26 22:24:23.790528	208	2026-05-26 22:24:23.790527	\N	\N	\N	\N	A. Ueda	\N	https://media.api-sports.io/football/players/72155.png
119853	\N	2026-05-26 22:24:23.797529	209	2026-05-26 22:24:23.798528	\N	\N	\N	\N	M. Diaw	\N	https://media.api-sports.io/football/players/119853.png
20566	\N	2026-05-26 22:24:23.805528	210	2026-05-26 22:24:23.805528	\N	\N	\N	\N	Y. Diouf	\N	https://media.api-sports.io/football/players/20566.png
2986	\N	2026-05-26 22:24:23.811527	211	2026-05-26 22:24:23.81253	\N	\N	\N	\N	É. Mendy	\N	https://media.api-sports.io/football/players/2986.png
409303	\N	2026-05-26 22:24:23.824527	212	2026-05-26 22:24:23.824527	\N	\N	\N	\N	E. Diouf	\N	https://media.api-sports.io/football/players/409303.png
158121	\N	2026-05-26 22:24:23.834529	213	2026-05-26 22:24:23.834528	\N	\N	\N	\N	I. Jakobs	\N	https://media.api-sports.io/football/players/158121.png
318	\N	2026-05-26 22:24:23.844529	214	2026-05-26 22:24:23.844528	\N	\N	\N	\N	K. Koulibaly	\N	https://media.api-sports.io/football/players/318.png
313937	\N	2026-05-26 22:24:23.853528	215	2026-05-26 22:24:23.853527	\N	\N	\N	\N	A. Mendy	\N	https://media.api-sports.io/football/players/313937.png
358431	\N	2026-05-26 22:24:23.861527	216	2026-05-26 22:24:23.861526	\N	\N	\N	\N	N. Mendy	\N	https://media.api-sports.io/football/players/358431.png
25916	\N	2026-05-26 22:24:23.866527	217	2026-05-26 22:24:23.867527	\N	\N	\N	\N	M. Niakhaté	\N	https://media.api-sports.io/football/players/25916.png
276184	\N	2026-05-26 22:24:23.872528	218	2026-05-26 22:24:23.872527	\N	\N	\N	\N	M. Sarr	\N	https://media.api-sports.io/football/players/276184.png
8450	\N	2026-05-26 22:24:23.878528	219	2026-05-26 22:24:23.878527	\N	\N	\N	\N	A. Seck	\N	https://media.api-sports.io/football/players/8450.png
371839	\N	2026-05-26 22:24:23.884528	220	2026-05-26 22:24:23.884527	\N	\N	\N	\N	I. Camara	\N	https://media.api-sports.io/football/players/371839.png
374058	\N	2026-05-26 22:24:23.892527	221	2026-05-26 22:24:23.892527	\N	\N	\N	\N	L. Camara	\N	https://media.api-sports.io/football/players/374058.png
344813	\N	2026-05-26 22:24:23.898527	222	2026-05-26 22:24:23.898526	\N	\N	\N	\N	M. Camara	\N	https://media.api-sports.io/football/players/344813.png
41552	\N	2026-05-26 22:24:23.903527	223	2026-05-26 22:24:23.903527	\N	\N	\N	\N	P. Ciss	\N	https://media.api-sports.io/football/players/41552.png
327631	\N	2026-05-26 22:24:23.908526	224	2026-05-26 22:24:23.908526	\N	\N	\N	\N	H. Diarra	\N	https://media.api-sports.io/football/players/327631.png
81	\N	2026-05-26 22:24:23.913527	225	2026-05-26 22:24:23.913526	\N	\N	\N	\N	K. Diatta	\N	https://media.api-sports.io/football/players/81.png
2990	\N	2026-05-26 22:24:23.91753	226	2026-05-26 22:24:23.918526	\N	\N	\N	\N	I. Gueye	\N	https://media.api-sports.io/football/players/2990.png
20696	\N	2026-05-26 22:24:23.924528	227	2026-05-26 22:24:23.924527	\N	\N	\N	\N	P. Gueye	\N	https://media.api-sports.io/football/players/20696.png
237129	\N	2026-05-26 22:24:23.928527	228	2026-05-26 22:24:23.928527	\N	\N	\N	\N	P. Sarr	\N	https://media.api-sports.io/football/players/237129.png
22015	\N	2026-05-26 22:24:23.933527	229	2026-05-26 22:24:23.933526	\N	\N	\N	\N	B. Dia	\N	https://media.api-sports.io/football/players/22015.png
386481	\N	2026-05-26 22:24:23.938528	230	2026-05-26 22:24:23.938528	\N	\N	\N	\N	M. Diakhon	\N	https://media.api-sports.io/football/players/386481.png
20535	\N	2026-05-26 22:24:23.942527	231	2026-05-26 22:24:23.942527	\N	\N	\N	\N	H. Diallo	\N	https://media.api-sports.io/football/players/20535.png
400948	\N	2026-05-26 22:24:23.947527	232	2026-05-26 22:24:23.947526	\N	\N	\N	\N	Assane Diao	\N	https://media.api-sports.io/football/players/400948.png
284072	\N	2026-05-26 22:24:23.953527	233	2026-05-26 22:24:23.953526	\N	\N	\N	\N	B. Dieng	\N	https://media.api-sports.io/football/players/284072.png
283058	\N	2026-05-26 22:24:23.957527	234	2026-05-26 22:24:23.957527	\N	\N	\N	\N	N. Jackson	\N	https://media.api-sports.io/football/players/283058.png
304	\N	2026-05-26 22:24:23.963527	235	2026-05-26 22:24:23.963526	\N	\N	\N	\N	S. Mané	\N	https://media.api-sports.io/football/players/304.png
446249	\N	2026-05-26 22:24:23.968527	236	2026-05-26 22:24:23.968527	\N	\N	\N	\N	I. Mbaye	\N	https://media.api-sports.io/football/players/446249.png
14379	\N	2026-05-26 22:24:23.973527	237	2026-05-26 22:24:23.973527	\N	\N	\N	\N	C. Ndiaye	\N	https://media.api-sports.io/football/players/14379.png
18592	\N	2026-05-26 22:24:23.977527	238	2026-05-26 22:24:23.977527	\N	\N	\N	\N	I. Ndiaye	\N	https://media.api-sports.io/football/players/18592.png
203456	\N	2026-05-26 22:24:23.982528	239	2026-05-26 22:24:23.982527	\N	\N	\N	\N	O. Niang	\N	https://media.api-sports.io/football/players/203456.png
20534	\N	2026-05-26 22:24:23.98753	240	2026-05-26 22:24:23.987529	\N	\N	\N	\N	C. Sabaly	\N	https://media.api-sports.io/football/players/20534.png
2218	\N	2026-05-26 22:24:23.999527	241	2026-05-26 22:24:23.999527	\N	\N	\N	\N	I. Sarr	\N	https://media.api-sports.io/football/players/2218.png
441289	\N	2026-05-26 22:24:24.007528	242	2026-05-26 22:24:24.007528	\N	\N	\N	\N	Vuk Draškić	\N	https://media.api-sports.io/football/players/441289.png
322180	\N	2026-05-26 22:24:24.012526	243	2026-05-26 22:24:24.012526	\N	\N	\N	\N	V. Ilić	\N	https://media.api-sports.io/football/players/322180.png
342328	\N	2026-05-26 22:24:24.017527	244	2026-05-26 22:24:24.017526	\N	\N	\N	\N	L. LijeskiÄ	\N	https://media.api-sports.io/football/players/342328.png
31156	\N	2026-05-26 22:24:24.031527	245	2026-05-26 22:24:24.031526	\N	\N	\N	\N	V. Milinković-Savić	\N	https://media.api-sports.io/football/players/31156.png
118307	\N	2026-05-26 22:24:24.036528	246	2026-05-26 22:24:24.036528	\N	\N	\N	\N	Đ. Petrović	\N	https://media.api-sports.io/football/players/118307.png
2814	\N	2026-05-26 22:24:24.04153	247	2026-05-26 22:24:24.041529	\N	\N	\N	\N	P. Rajković	\N	https://media.api-sports.io/football/players/2814.png
45846	\N	2026-05-26 22:24:24.046528	248	2026-05-26 22:24:24.046528	\N	\N	\N	\N	D. Rosić	\N	https://media.api-sports.io/football/players/45846.png
361396	\N	2026-05-26 22:24:24.05153	249	2026-05-26 22:24:24.05153	\N	\N	\N	\N	S. Bukinac	\N	https://media.api-sports.io/football/players/361396.png
133391	\N	2026-05-26 22:24:24.056527	250	2026-05-26 22:24:24.056526	\N	\N	\N	\N	S. Eraković	\N	https://media.api-sports.io/football/players/133391.png
2817	\N	2026-05-26 22:24:24.06353	251	2026-05-26 22:24:24.063529	\N	\N	\N	\N	N. Milenković	\N	https://media.api-sports.io/football/players/2817.png
412719	\N	2026-05-26 22:24:24.069527	252	2026-05-26 22:24:24.069527	\N	\N	\N	\N	Veljko Milosavljević	\N	https://media.api-sports.io/football/players/412719.png
340727	\N	2026-05-26 22:24:24.07353	253	2026-05-26 22:24:24.073529	\N	\N	\N	\N	O. MimoviÄ	\N	https://media.api-sports.io/football/players/340727.png
342320	\N	2026-05-26 22:24:24.078527	254	2026-05-26 22:24:24.078526	\N	\N	\N	\N	K. Nedeljković	\N	https://media.api-sports.io/football/players/342320.png
45826	\N	2026-05-26 22:24:24.08253	255	2026-05-26 22:24:24.08253	\N	\N	\N	\N	S. Pavlović	\N	https://media.api-sports.io/football/players/45826.png
371910	\N	2026-05-26 22:24:24.086529	256	2026-05-26 22:24:24.086529	\N	\N	\N	\N	J. Šimić	\N	https://media.api-sports.io/football/players/371910.png
349	\N	2026-05-26 22:24:24.092527	257	2026-05-26 22:24:24.092526	\N	\N	\N	\N	A. Terzić	\N	https://media.api-sports.io/football/players/349.png
2821	\N	2026-05-26 22:24:24.098528	258	2026-05-26 22:24:24.098527	\N	\N	\N	\N	M. Veljković	\N	https://media.api-sports.io/football/players/2821.png
443802	\N	2026-05-26 22:24:24.102528	259	2026-05-26 22:24:24.102527	\N	\N	\N	\N	V. Dragojević	\N	https://media.api-sports.io/football/players/443802.png
1818	\N	2026-05-26 22:24:24.107527	260	2026-05-26 22:24:24.107526	\N	\N	\N	\N	M. Gaćinović	\N	https://media.api-sports.io/football/players/1818.png
25350	\N	2026-05-26 22:24:24.11153	261	2026-05-26 22:24:24.11153	\N	\N	\N	\N	M. Grujić	\N	https://media.api-sports.io/football/players/25350.png
1489	\N	2026-05-26 22:24:24.116527	262	2026-05-26 22:24:24.116526	\N	\N	\N	\N	N. Gudelj	\N	https://media.api-sports.io/football/players/1489.png
46170	\N	2026-05-26 22:24:24.122528	263	2026-05-26 22:24:24.122528	\N	\N	\N	\N	I. Ilić	\N	https://media.api-sports.io/football/players/46170.png
38699	\N	2026-05-26 22:24:24.127527	264	2026-05-26 22:24:24.127527	\N	\N	\N	\N	L. Ilić	\N	https://media.api-sports.io/football/players/38699.png
50910	\N	2026-05-26 22:24:24.131531	265	2026-05-26 22:24:24.13153	\N	\N	\N	\N	A. Katai	\N	https://media.api-sports.io/football/players/50910.png
1821	\N	2026-05-26 22:24:24.135527	266	2026-05-26 22:24:24.135527	\N	\N	\N	\N	F. Kostić	\N	https://media.api-sports.io/football/players/1821.png
462208	\N	2026-05-26 22:24:24.140527	267	2026-05-26 22:24:24.140526	\N	\N	\N	\N	V. Kostov	\N	https://media.api-sports.io/football/players/462208.png
2823	\N	2026-05-26 22:24:24.145527	268	2026-05-26 22:24:24.145527	\N	\N	\N	\N	S. Lukić	\N	https://media.api-sports.io/football/players/2823.png
2824	\N	2026-05-26 22:24:24.14953	269	2026-05-26 22:24:24.14953	\N	\N	\N	\N	N. Maksimović	\N	https://media.api-sports.io/football/players/2824.png
1856	\N	2026-05-26 22:24:24.156529	270	2026-05-26 22:24:24.156529	\N	\N	\N	\N	S. Milinković-Savić	\N	https://media.api-sports.io/football/players/1856.png
46090	\N	2026-05-26 22:24:24.16153	271	2026-05-26 22:24:24.161529	\N	\N	\N	\N	N. Petrović	\N	https://media.api-sports.io/football/players/46090.png
178749	\N	2026-05-26 22:24:24.165526	272	2026-05-26 22:24:24.166527	\N	\N	\N	\N	L. Samardžić	\N	https://media.api-sports.io/football/players/178749.png
274371	\N	2026-05-26 22:24:24.171529	273	2026-05-26 22:24:24.171529	\N	\N	\N	\N	P. Stanić	\N	https://media.api-sports.io/football/players/274371.png
342230	\N	2026-05-26 22:24:24.178527	274	2026-05-26 22:24:24.178527	\N	\N	\N	\N	A. Stanković	\N	https://media.api-sports.io/football/players/342230.png
579	\N	2026-05-26 22:24:24.183528	275	2026-05-26 22:24:24.183527	\N	\N	\N	\N	A. Živković	\N	https://media.api-sports.io/football/players/579.png
45950	\N	2026-05-26 22:24:24.189528	276	2026-05-26 22:24:24.189527	\N	\N	\N	\N	D. Zukić	\N	https://media.api-sports.io/football/players/45950.png
45804	\N	2026-05-26 22:24:24.195528	277	2026-05-26 22:24:24.195528	\N	\N	\N	\N	V. Birmančević	\N	https://media.api-sports.io/football/players/45804.png
544636	\N	2026-05-26 22:24:24.200529	278	2026-05-26 22:24:24.200528	\N	\N	\N	\N	M. Cvetkovic	\N	https://media.api-sports.io/football/players/544636.png
45892	\N	2026-05-26 22:24:24.20553	279	2026-05-26 22:24:24.205529	\N	\N	\N	\N	A. Ilić	\N	https://media.api-sports.io/football/players/45892.png
364	\N	2026-05-26 22:24:24.210527	280	2026-05-26 22:24:24.210526	\N	\N	\N	\N	D. Joveljić	\N	https://media.api-sports.io/football/players/364.png
1828	\N	2026-05-26 22:24:24.21453	281	2026-05-26 22:24:24.214529	\N	\N	\N	\N	L. Jović	\N	https://media.api-sports.io/football/players/1828.png
2825	\N	2026-05-26 22:24:24.219527	282	2026-05-26 22:24:24.219527	\N	\N	\N	\N	A. Mitrović	\N	https://media.api-sports.io/football/players/2825.png
180128	\N	2026-05-26 22:24:24.224527	283	2026-05-26 22:24:24.224526	\N	\N	\N	\N	S. Mitrović	\N	https://media.api-sports.io/football/players/180128.png
1920	\N	2026-05-26 22:24:24.228528	284	2026-05-26 22:24:24.228528	\N	\N	\N	\N	N. Radonjić	\N	https://media.api-sports.io/football/players/1920.png
45792	\N	2026-05-26 22:24:24.233527	285	2026-05-26 22:24:24.233526	\N	\N	\N	\N	L. Ranđelović	\N	https://media.api-sports.io/football/players/45792.png
301763	\N	2026-05-26 22:24:24.237527	286	2026-05-26 22:24:24.237526	\N	\N	\N	\N	P. Ratkov	\N	https://media.api-sports.io/football/players/301763.png
30415	\N	2026-05-26 22:24:24.24153	287	2026-05-26 22:24:24.241529	\N	\N	\N	\N	D. Vlahović	\N	https://media.api-sports.io/football/players/30415.png
123468	\N	2026-05-26 22:24:55.749993	288	2026-05-26 22:24:55.749993	\N	\N	\N	\N	M. Keller	\N	https://media.api-sports.io/football/players/123468.png
25282	\N	2026-05-26 22:24:55.756994	289	2026-05-26 22:24:55.757993	\N	\N	\N	\N	G. Kobel	\N	https://media.api-sports.io/football/players/25282.png
1142	\N	2026-05-26 22:24:55.76347	290	2026-05-26 22:24:55.763997	\N	\N	\N	\N	Y. Mvogo	\N	https://media.api-sports.io/football/players/1142.png
5	\N	2026-05-26 22:24:55.769179	291	2026-05-26 22:24:55.769286	\N	\N	\N	\N	M. Akanji	\N	https://media.api-sports.io/football/players/5.png
162414	\N	2026-05-26 22:24:55.774088	292	2026-05-26 22:24:55.774087	\N	\N	\N	\N	A. Amenda	\N	https://media.api-sports.io/football/players/162414.png
48372	\N	2026-05-26 22:24:55.77878	293	2026-05-26 22:24:55.77878	\N	\N	\N	\N	E. Cömert	\N	https://media.api-sports.io/football/players/48372.png
2803	\N	2026-05-26 22:24:55.783417	294	2026-05-26 22:24:55.783416	\N	\N	\N	\N	N. Elvedi	\N	https://media.api-sports.io/football/players/2803.png
349344	\N	2026-05-26 22:24:55.789536	295	2026-05-26 22:24:55.789555	\N	\N	\N	\N	L. Jaquez	\N	https://media.api-sports.io/football/players/349344.png
48489	\N	2026-05-26 22:24:55.793216	296	2026-05-26 22:24:55.793747	\N	\N	\N	\N	M. Muheim	\N	https://media.api-sports.io/football/players/48489.png
1631	\N	2026-05-26 22:24:55.79742	297	2026-05-26 22:24:55.797419	\N	\N	\N	\N	R. Rodríguez	\N	https://media.api-sports.io/football/players/1631.png
48378	\N	2026-05-26 22:24:55.803842	298	2026-05-26 22:24:55.803841	\N	\N	\N	\N	S. Widmer	\N	https://media.api-sports.io/football/players/48378.png
951	\N	2026-05-26 22:24:55.807539	299	2026-05-26 22:24:55.807539	\N	\N	\N	\N	M. Aebischer	\N	https://media.api-sports.io/football/players/951.png
2807	\N	2026-05-26 22:24:55.811767	300	2026-05-26 22:24:55.811767	\N	\N	\N	\N	R. Freuler	\N	https://media.api-sports.io/football/players/2807.png
264705	\N	2026-05-26 22:24:55.816051	301	2026-05-26 22:24:55.81605	\N	\N	\N	\N	A. Jashari	\N	https://media.api-sports.io/football/players/264705.png
406244	\N	2026-05-26 22:24:55.824566	302	2026-05-26 22:24:55.824565	\N	\N	\N	\N	J. Manzambi	\N	https://media.api-sports.io/football/players/406244.png
277862	\N	2026-05-26 22:24:55.829822	303	2026-05-26 22:24:55.829821	\N	\N	\N	\N	Joël Monteiro	\N	https://media.api-sports.io/football/players/277862.png
290646	\N	2026-05-26 22:24:55.834801	304	2026-05-26 22:24:55.8348	\N	\N	\N	\N	A. Sanches	\N	https://media.api-sports.io/football/players/290646.png
48491	\N	2026-05-26 22:24:55.840034	305	2026-05-26 22:24:55.840034	\N	\N	\N	\N	V. Sierro	\N	https://media.api-sports.io/football/players/48491.png
957	\N	2026-05-26 22:24:55.844228	306	2026-05-26 22:24:55.844228	\N	\N	\N	\N	D. Sow	\N	https://media.api-sports.io/football/players/957.png
48471	\N	2026-05-26 22:24:55.849817	307	2026-05-26 22:24:55.849835	\N	\N	\N	\N	R. Vargas	\N	https://media.api-sports.io/football/players/48471.png
1464	\N	2026-05-26 22:24:55.854026	308	2026-05-26 22:24:55.854026	\N	\N	\N	\N	G. Xhaka	\N	https://media.api-sports.io/football/players/1464.png
2810	\N	2026-05-26 22:24:55.857685	309	2026-05-26 22:24:55.858201	\N	\N	\N	\N	D. Zakaria	\N	https://media.api-sports.io/football/players/2810.png
421	\N	2026-05-26 22:24:55.861942	310	2026-05-26 22:24:55.861941	\N	\N	\N	\N	B. Embolo	\N	https://media.api-sports.io/football/players/421.png
48648	\N	2026-05-26 22:24:55.865636	311	2026-05-26 22:24:55.865635	\N	\N	\N	\N	D. Ndoye	\N	https://media.api-sports.io/football/players/48648.png
48389	\N	2026-05-26 22:24:55.869286	312	2026-05-26 22:24:55.869285	\N	\N	\N	\N	N. Okafor	\N	https://media.api-sports.io/football/players/48389.png
163032	\N	2026-05-26 22:24:55.872951	313	2026-05-26 22:24:55.87295	\N	\N	\N	\N	F. Rieder	\N	https://media.api-sports.io/football/players/163032.png
35769	\N	2026-05-26 22:24:55.87724	314	2026-05-26 22:24:55.877239	\N	\N	\N	\N	C. Acevedo	\N	https://media.api-sports.io/football/players/35769.png
35930	\N	2026-05-26 22:24:55.880911	315	2026-05-26 22:24:55.88091	\N	\N	\N	\N	L. Malagón	\N	https://media.api-sports.io/football/players/35930.png
2098	\N	2026-05-26 22:24:55.885128	316	2026-05-26 22:24:55.885127	\N	\N	\N	\N	G. Ochoa	\N	https://media.api-sports.io/football/players/2098.png
270774	\N	2026-05-26 22:24:55.888804	317	2026-05-26 22:24:55.888803	\N	\N	\N	\N	J. Rangel	\N	https://media.api-sports.io/football/players/270774.png
375586	\N	2026-05-26 22:24:55.894185	318	2026-05-26 22:24:55.894184	\N	\N	\N	\N	E.  Águila	\N	https://media.api-sports.io/football/players/375586.png
126751	\N	2026-05-26 22:24:55.899448	319	2026-05-26 22:24:55.899447	\N	\N	\N	\N	K. Álvarez	\N	https://media.api-sports.io/football/players/126751.png
35773	\N	2026-05-26 22:24:55.904668	320	2026-05-26 22:24:55.904667	\N	\N	\N	\N	J. Angulo	\N	https://media.api-sports.io/football/players/35773.png
141155	\N	2026-05-26 22:24:55.909514	321	2026-05-26 22:24:55.909513	\N	\N	\N	\N	D. Campillo	\N	https://media.api-sports.io/football/players/141155.png
2881	\N	2026-05-26 22:24:55.91383	322	2026-05-26 22:24:55.914355	\N	\N	\N	\N	J. Gallardo	\N	https://media.api-sports.io/football/players/2881.png
35524	\N	2026-05-26 22:24:55.918529	323	2026-05-26 22:24:55.918528	\N	\N	\N	\N	J. Garza	\N	https://media.api-sports.io/football/players/35524.png
129943	\N	2026-05-26 22:24:55.922183	324	2026-05-26 22:24:55.922182	\N	\N	\N	\N	V. Guzmán	\N	https://media.api-sports.io/football/players/129943.png
180734	\N	2026-05-26 22:24:55.926992	325	2026-05-26 22:24:55.926992	\N	\N	\N	\N	R. Juárez	\N	https://media.api-sports.io/football/players/180734.png
2873	\N	2026-05-26 22:24:55.931185	326	2026-05-26 22:24:55.931184	\N	\N	\N	\N	C. Montes	\N	https://media.api-sports.io/football/players/2873.png
290059	\N	2026-05-26 22:24:55.935365	327	2026-05-26 22:24:55.935364	\N	\N	\N	\N	J. Orozco	\N	https://media.api-sports.io/football/players/290059.png
127227	\N	2026-05-26 22:24:55.939199	328	2026-05-26 22:24:55.939198	\N	\N	\N	\N	I. Reyes	\N	https://media.api-sports.io/football/players/127227.png
2878	\N	2026-05-26 22:24:55.943405	329	2026-05-26 22:24:55.943404	\N	\N	\N	\N	J. Sánchez	\N	https://media.api-sports.io/football/players/2878.png
35544	\N	2026-05-26 22:24:55.947065	330	2026-05-26 22:24:55.947079	\N	\N	\N	\N	J. Vásquez	\N	https://media.api-sports.io/football/players/35544.png
362815	\N	2026-05-26 22:24:55.950881	331	2026-05-26 22:24:55.95088	\N	\N	\N	\N	E. López	\N	https://media.api-sports.io/football/players/362815.png
2879	\N	2026-05-26 22:24:55.955701	332	2026-05-26 22:24:55.955701	\N	\N	\N	\N	R. Alvarado	\N	https://media.api-sports.io/football/players/2879.png
2869	\N	2026-05-26 22:24:55.960434	333	2026-05-26 22:24:55.960433	\N	\N	\N	\N	E. Álvarez	\N	https://media.api-sports.io/football/players/2869.png
51068	\N	2026-05-26 22:24:55.964732	334	2026-05-26 22:24:55.964732	\N	\N	\N	\N	E. Álvarez	\N	https://media.api-sports.io/football/players/51068.png
167014	\N	2026-05-26 22:24:55.968917	335	2026-05-26 22:24:55.968917	\N	\N	\N	\N	F. Ambríz	\N	https://media.api-sports.io/football/players/167014.png
35716	\N	2026-05-26 22:24:55.973233	336	2026-05-26 22:24:55.973233	\N	\N	\N	\N	K. Castañeda	\N	https://media.api-sports.io/football/players/35716.png
390002	\N	2026-05-26 22:24:55.976901	337	2026-05-26 22:24:55.9769	\N	\N	\N	\N	M. Chávez	\N	https://media.api-sports.io/football/players/390002.png
750	\N	2026-05-26 22:24:55.98065	338	2026-05-26 22:24:55.98065	\N	\N	\N	\N	Álvaro Fidalgo	\N	https://media.api-sports.io/football/players/750.png
426512	\N	2026-05-26 22:24:55.984328	339	2026-05-26 22:24:55.984327	\N	\N	\N	\N	Iker Jareth Fimbres Ochoa	\N	https://media.api-sports.io/football/players/426512.png
359835	\N	2026-05-26 22:24:55.98854	340	2026-05-26 22:24:55.988539	\N	\N	\N	\N	D. García	\N	https://media.api-sports.io/football/players/359835.png
237060	\N	2026-05-26 22:24:55.992707	341	2026-05-26 22:24:55.992706	\N	\N	\N	\N	B. González	\N	https://media.api-sports.io/football/players/237060.png
212233	\N	2026-05-26 22:24:55.996389	342	2026-05-26 22:24:55.996388	\N	\N	\N	\N	B. Gutiérrez	\N	https://media.api-sports.io/football/players/212233.png
35573	\N	2026-05-26 22:24:56.000676	343	2026-05-26 22:24:56.000676	\N	\N	\N	\N	A. Gutiérrez	\N	https://media.api-sports.io/football/players/35573.png
102851	\N	2026-05-26 22:24:56.005387	344	2026-05-26 22:24:56.005394	\N	\N	\N	\N	R. Ledezma	\N	https://media.api-sports.io/football/players/102851.png
266345	\N	2026-05-26 22:24:56.009586	345	2026-05-26 22:24:56.009585	\N	\N	\N	\N	É. Lira	\N	https://media.api-sports.io/football/players/266345.png
482605	\N	2026-05-26 22:24:56.014149	346	2026-05-26 22:24:56.014149	\N	\N	\N	\N	G. Mora	\N	https://media.api-sports.io/football/players/482605.png
35576	\N	2026-05-26 22:24:56.018148	347	2026-05-26 22:24:56.018148	\N	\N	\N	\N	O. Pineda	\N	https://media.api-sports.io/football/players/35576.png
2888	\N	2026-05-26 22:24:56.023147	348	2026-05-26 22:24:56.023147	\N	\N	\N	\N	C. Rodríguez	\N	https://media.api-sports.io/football/players/2888.png
35970	\N	2026-05-26 22:24:56.027524	349	2026-05-26 22:24:56.027524	\N	\N	\N	\N	L. Romo	\N	https://media.api-sports.io/football/players/35970.png
35981	\N	2026-05-26 22:24:56.031979	350	2026-05-26 22:24:56.031978	\N	\N	\N	\N	M. Ruiz	\N	https://media.api-sports.io/football/players/35981.png
36093	\N	2026-05-26 22:24:56.037271	351	2026-05-26 22:24:56.03727	\N	\N	\N	\N	É. Sánchez	\N	https://media.api-sports.io/football/players/36093.png
313383	\N	2026-05-26 22:24:56.04309	352	2026-05-26 22:24:56.043089	\N	\N	\N	\N	O. Vargas	\N	https://media.api-sports.io/football/players/313383.png
6485	\N	2026-05-26 22:24:56.048669	353	2026-05-26 22:24:56.048669	\N	\N	\N	\N	G. Berterame	\N	https://media.api-sports.io/football/players/6485.png
291713	\N	2026-05-26 22:24:56.053998	354	2026-05-26 22:24:56.053997	\N	\N	\N	\N	A. González	\N	https://media.api-sports.io/football/players/291713.png
2887	\N	2026-05-26 22:24:56.05924	355	2026-05-26 22:24:56.059266	\N	\N	\N	\N	R. Jiménez	\N	https://media.api-sports.io/football/players/2887.png
1577	\N	2026-05-26 22:24:56.064133	356	2026-05-26 22:24:56.064132	\N	\N	\N	\N	D. Lainez	\N	https://media.api-sports.io/football/players/1577.png
248	\N	2026-05-26 22:24:56.068864	357	2026-05-26 22:24:56.068863	\N	\N	\N	\N	H. Lozano	\N	https://media.api-sports.io/football/players/248.png
36088	\N	2026-05-26 22:24:56.073078	358	2026-05-26 22:24:56.073077	\N	\N	\N	\N	G. Martínez	\N	https://media.api-sports.io/football/players/36088.png
35532	\N	2026-05-26 22:24:56.077918	359	2026-05-26 22:24:56.077917	\N	\N	\N	\N	J. Quiñones	\N	https://media.api-sports.io/football/players/35532.png
341970	\N	2026-05-26 22:24:56.08319	360	2026-05-26 22:24:56.083716	\N	\N	\N	\N	J. Ruvalcaba	\N	https://media.api-sports.io/football/players/341970.png
35645	\N	2026-05-26 22:24:56.08812	361	2026-05-26 22:24:56.08812	\N	\N	\N	\N	Á. Sepúlveda	\N	https://media.api-sports.io/football/players/35645.png
2889	\N	2026-05-26 22:24:56.09349	362	2026-05-26 22:24:56.093489	\N	\N	\N	\N	A. Vega	\N	https://media.api-sports.io/football/players/2889.png
2890	\N	2026-05-26 22:24:56.100475	363	2026-05-26 22:24:56.100474	\N	\N	\N	\N	Jo Hyeon-Woo	\N	https://media.api-sports.io/football/players/2890.png
2892	\N	2026-05-26 22:24:56.111607	364	2026-05-26 22:24:56.111606	\N	\N	\N	\N	Kim Seung-Gyu	\N	https://media.api-sports.io/football/players/2892.png
34374	\N	2026-05-26 22:24:56.117948	365	2026-05-26 22:24:56.117948	\N	\N	\N	\N	Song Bum-Keun	\N	https://media.api-sports.io/football/players/34374.png
34239	\N	2026-05-26 22:24:56.124003	366	2026-05-26 22:24:56.124002	\N	\N	\N	\N	Cho Yu-Min	\N	https://media.api-sports.io/football/players/34239.png
2897	\N	2026-05-26 22:24:56.129885	367	2026-05-26 22:24:56.129885	\N	\N	\N	\N	Kim Min-Jae	\N	https://media.api-sports.io/football/players/2897.png
2912	\N	2026-05-26 22:24:56.136752	368	2026-05-26 22:24:56.136751	\N	\N	\N	\N	Kim Moon-Hwan	\N	https://media.api-sports.io/football/players/2912.png
34418	\N	2026-05-26 22:24:56.142688	369	2026-05-26 22:24:56.142687	\N	\N	\N	\N	Kim Tae-Hyeon	\N	https://media.api-sports.io/football/players/34418.png
304951	\N	2026-05-26 22:24:56.147583	370	2026-05-26 22:24:56.147583	\N	\N	\N	\N	Lee Gi-Hyuk	\N	https://media.api-sports.io/football/players/304951.png
237218	\N	2026-05-26 22:24:56.151786	371	2026-05-26 22:24:56.151785	\N	\N	\N	\N	Lee Han-Beom	\N	https://media.api-sports.io/football/players/237218.png
237220	\N	2026-05-26 22:24:56.156756	372	2026-05-26 22:24:56.156756	\N	\N	\N	\N	Lee Tae-Seok	\N	https://media.api-sports.io/football/players/237220.png
197985	\N	2026-05-26 22:24:56.160939	373	2026-05-26 22:24:56.160938	\N	\N	\N	\N	Seol Young-Woo	\N	https://media.api-sports.io/football/players/197985.png
357286	\N	2026-05-26 22:24:56.165146	374	2026-05-26 22:24:56.165146	\N	\N	\N	\N	Bae Jun-Ho	\N	https://media.api-sports.io/football/players/357286.png
280358	\N	2026-05-26 22:24:56.17	375	2026-05-26 22:24:56.17	\N	\N	\N	\N	J. Castrop	\N	https://media.api-sports.io/football/players/280358.png
237050	\N	2026-05-26 22:24:56.174713	376	2026-05-26 22:24:56.174712	\N	\N	\N	\N	Eom Ji-Sung	\N	https://media.api-sports.io/football/players/237050.png
2901	\N	2026-05-26 22:24:56.179431	377	2026-05-26 22:24:56.17943	\N	\N	\N	\N	Hwang In-Beom	\N	https://media.api-sports.io/football/players/2901.png
34168	\N	2026-05-26 22:24:56.183989	378	2026-05-26 22:24:56.183989	\N	\N	\N	\N	Kim Jin-Gyu	\N	https://media.api-sports.io/football/players/34168.png
34431	\N	2026-05-26 22:24:56.188197	379	2026-05-26 22:24:56.188196	\N	\N	\N	\N	Lee Dong-Gyeong	\N	https://media.api-sports.io/football/players/34431.png
2906	\N	2026-05-26 22:24:56.192473	380	2026-05-26 22:24:56.192473	\N	\N	\N	\N	Lee Jae-Sung	\N	https://media.api-sports.io/football/players/2906.png
927	\N	2026-05-26 22:24:56.196682	381	2026-05-26 22:24:56.196682	\N	\N	\N	\N	Lee Kang-In	\N	https://media.api-sports.io/football/players/927.png
2909	\N	2026-05-26 22:24:56.202318	382	2026-05-26 22:24:56.202317	\N	\N	\N	\N	Paik Seung-Ho	\N	https://media.api-sports.io/football/players/2909.png
99211	\N	2026-05-26 22:24:56.208352	383	2026-05-26 22:24:56.209352	\N	\N	\N	\N	Park Jin-Seop	\N	https://media.api-sports.io/football/players/99211.png
304958	\N	2026-05-26 22:24:56.214352	384	2026-05-26 22:24:56.214352	\N	\N	\N	\N	Yang Hyun-Jun	\N	https://media.api-sports.io/football/players/304958.png
34211	\N	2026-05-26 22:24:56.222352	385	2026-05-26 22:24:56.222352	\N	\N	\N	\N	Cho Gue-Sung	\N	https://media.api-sports.io/football/players/34211.png
24888	\N	2026-05-26 22:24:56.236354	386	2026-05-26 22:24:56.236353	\N	\N	\N	\N	Hwang Hee-Chan	\N	https://media.api-sports.io/football/players/24888.png
34710	\N	2026-05-26 22:24:56.246354	387	2026-05-26 22:24:56.246353	\N	\N	\N	\N	Oh Hyeon-Gyu	\N	https://media.api-sports.io/football/players/34710.png
186	\N	2026-05-26 22:24:56.255354	388	2026-05-26 22:24:56.255354	\N	\N	\N	\N	Son Heung-Min	\N	https://media.api-sports.io/football/players/186.png
353883	\N	2026-05-26 22:24:56.261356	389	2026-05-26 22:24:56.262354	\N	\N	\N	\N	P. Beach	\N	https://media.api-sports.io/football/players/353883.png
6870	\N	2026-05-26 22:24:56.268355	390	2026-05-26 22:24:56.268354	\N	\N	\N	\N	P. Izzo	\N	https://media.api-sports.io/football/players/6870.png
2741	\N	2026-05-26 22:24:56.273354	391	2026-05-26 22:24:56.273353	\N	\N	\N	\N	M. Ryan	\N	https://media.api-sports.io/football/players/2741.png
225	\N	2026-05-26 22:24:56.278353	392	2026-05-26 22:24:56.278353	\N	\N	\N	\N	A. Behich	\N	https://media.api-sports.io/football/players/225.png
337587	\N	2026-05-26 22:24:56.284354	393	2026-05-26 22:24:56.284353	\N	\N	\N	\N	J. Bos	\N	https://media.api-sports.io/football/players/337587.png
20457	\N	2026-05-26 22:24:56.290353	394	2026-05-26 22:24:56.290353	\N	\N	\N	\N	C. Burgess	\N	https://media.api-sports.io/football/players/20457.png
348568	\N	2026-05-26 22:24:56.296354	395	2026-05-26 22:24:56.296353	\N	\N	\N	\N	A. Circati	\N	https://media.api-sports.io/football/players/348568.png
33847	\N	2026-05-26 22:24:56.301356	396	2026-05-26 22:24:56.301355	\N	\N	\N	\N	J. Geria	\N	https://media.api-sports.io/football/players/33847.png
426480	\N	2026-05-26 22:24:56.307353	397	2026-05-26 22:24:56.307352	\N	\N	\N	\N	L. Herrington	\N	https://media.api-sports.io/football/players/426480.png
7038	\N	2026-05-26 22:24:56.311356	398	2026-05-26 22:24:56.311355	\N	\N	\N	\N	K. Rowles	\N	https://media.api-sports.io/football/players/7038.png
2742	\N	2026-05-26 22:24:56.316353	399	2026-05-26 22:24:56.316352	\N	\N	\N	\N	M. Degenek	\N	https://media.api-sports.io/football/players/2742.png
38123	\N	2026-05-26 22:24:56.321352	400	2026-05-26 22:24:56.321352	\N	\N	\N	\N	A. Hrustić	\N	https://media.api-sports.io/football/players/38123.png
6808	\N	2026-05-26 22:24:56.325354	401	2026-05-26 22:24:56.325353	\N	\N	\N	\N	J. Italiano	\N	https://media.api-sports.io/football/players/6808.png
6913	\N	2026-05-26 22:24:56.330353	402	2026-05-26 22:24:56.330352	\N	\N	\N	\N	R. McGree	\N	https://media.api-sports.io/football/players/6913.png
7050	\N	2026-05-26 22:24:56.334356	403	2026-05-26 22:24:56.334355	\N	\N	\N	\N	A. O&apos;Neill	\N	https://media.api-sports.io/football/players/7050.png
441269	\N	2026-05-26 22:24:56.338355	404	2026-05-26 22:24:56.338355	\N	\N	\N	\N	Paul Michael Junior Okon-Engstler	\N	https://media.api-sports.io/football/players/441269.png
288109	\N	2026-05-26 22:24:56.343354	405	2026-05-26 22:24:56.343353	\N	\N	\N	\N	A. Robertson	\N	https://media.api-sports.io/football/players/288109.png
153622	\N	2026-05-26 22:24:56.347353	406	2026-05-26 22:24:56.347352	\N	\N	\N	\N	K. Trewin	\N	https://media.api-sports.io/football/players/153622.png
269539	\N	2026-05-26 22:24:56.352353	407	2026-05-26 22:24:56.352352	\N	\N	\N	\N	P. Yazbek	\N	https://media.api-sports.io/football/players/269539.png
44843	\N	2026-05-26 22:24:56.356356	408	2026-05-26 22:24:56.356355	\N	\N	\N	\N	M. Boyle	\N	https://media.api-sports.io/football/players/44843.png
338014	\N	2026-05-26 22:24:56.361354	409	2026-05-26 22:24:56.361353	\N	\N	\N	\N	N. Irankunda	\N	https://media.api-sports.io/football/players/338014.png
14887	\N	2026-05-26 22:24:56.366038	410	2026-05-26 22:24:56.366038	\N	\N	\N	\N	D. Jurić	\N	https://media.api-sports.io/football/players/14887.png
2755	\N	2026-05-26 22:24:56.372894	411	2026-05-26 22:24:56.372893	\N	\N	\N	\N	A. Mabil	\N	https://media.api-sports.io/football/players/2755.png
6904	\N	2026-05-26 22:24:56.378757	412	2026-05-26 22:24:56.378757	\N	\N	\N	\N	C. Metcalfe	\N	https://media.api-sports.io/football/players/6904.png
316161	\N	2026-05-26 22:24:56.384048	413	2026-05-26 22:24:56.384047	\N	\N	\N	\N	A. Šuto	\N	https://media.api-sports.io/football/players/316161.png
312459	\N	2026-05-26 22:24:56.389379	414	2026-05-26 22:24:56.389379	\N	\N	\N	\N	N. Velupillay	\N	https://media.api-sports.io/football/players/312459.png
15870	\N	2026-05-26 22:24:56.394681	415	2026-05-26 22:24:56.394681	\N	\N	\N	\N	M. Hermansen	\N	https://media.api-sports.io/football/players/15870.png
277175	\N	2026-05-26 22:24:56.39897	416	2026-05-26 22:24:56.398969	\N	\N	\N	\N	A. Jungdal	\N	https://media.api-sports.io/football/players/277175.png
1798	\N	2026-05-26 22:24:56.403706	417	2026-05-26 22:24:56.403705	\N	\N	\N	\N	F. Rønnow	\N	https://media.api-sports.io/football/players/1798.png
2728	\N	2026-05-26 22:24:56.408524	418	2026-05-26 22:24:56.408524	\N	\N	\N	\N	K. Schmeichel	\N	https://media.api-sports.io/football/players/2728.png
2729	\N	2026-05-26 22:24:56.413253	419	2026-05-26 22:24:56.413253	\N	\N	\N	\N	J. Andersen	\N	https://media.api-sports.io/football/players/2729.png
15623	\N	2026-05-26 22:24:56.418134	420	2026-05-26 22:24:56.418133	\N	\N	\N	\N	A. Bah	\N	https://media.api-sports.io/football/players/15623.png
2282	\N	2026-05-26 22:24:56.422433	421	2026-05-26 22:24:56.422433	\N	\N	\N	\N	A. Christensen	\N	https://media.api-sports.io/football/players/2282.png
382452	\N	2026-05-26 22:24:56.428221	422	2026-05-26 22:24:56.428221	\N	\N	\N	\N	P. Dorgu	\N	https://media.api-sports.io/football/players/382452.png
396193	\N	2026-05-26 22:24:56.43297	423	2026-05-26 22:24:56.43297	\N	\N	\N	\N	L. Høgsberg	\N	https://media.api-sports.io/football/players/396193.png
533	\N	2026-05-26 22:24:56.437408	424	2026-05-26 22:24:56.437407	\N	\N	\N	\N	R. Kristensen	\N	https://media.api-sports.io/football/players/533.png
1930	\N	2026-05-26 22:24:56.441087	425	2026-05-26 22:24:56.441086	\N	\N	\N	\N	J. Mæhle	\N	https://media.api-sports.io/football/players/1930.png
24806	\N	2026-05-26 22:24:56.445298	426	2026-05-26 22:24:56.445297	\N	\N	\N	\N	N. Nartey	\N	https://media.api-sports.io/football/players/24806.png
15912	\N	2026-05-26 22:24:56.449503	427	2026-05-26 22:24:56.449502	\N	\N	\N	\N	V. Nelsson	\N	https://media.api-sports.io/football/players/15912.png
350857	\N	2026-05-26 22:24:56.4535	428	2026-05-26 22:24:56.453499	\N	\N	\N	\N	O. Provstgaard	\N	https://media.api-sports.io/football/players/350857.png
18943	\N	2026-05-26 22:24:56.4575	429	2026-05-26 22:24:56.457499	\N	\N	\N	\N	J. Vestergaard	\N	https://media.api-sports.io/football/players/18943.png
2734	\N	2026-05-26 22:24:56.461209	430	2026-05-26 22:24:56.461209	\N	\N	\N	\N	P. Billing	\N	https://media.api-sports.io/football/players/2734.png
15908	\N	2026-05-26 22:24:56.465438	431	2026-05-26 22:24:56.465438	\N	\N	\N	\N	M. Damsgaard	\N	https://media.api-sports.io/football/players/15908.png
174	\N	2026-05-26 22:24:56.469708	432	2026-05-26 22:24:56.469708	\N	\N	\N	\N	C. Eriksen	\N	https://media.api-sports.io/football/players/174.png
388872	\N	2026-05-26 22:24:56.47445	433	2026-05-26 22:24:56.474449	\N	\N	\N	\N	Victor Mow Froholdt	\N	https://media.api-sports.io/football/players/388872.png
7712	\N	2026-05-26 22:24:56.479454	434	2026-05-26 22:24:56.479453	\N	\N	\N	\N	M. Hjulmand	\N	https://media.api-sports.io/football/players/7712.png
2735	\N	2026-05-26 22:24:56.484877	435	2026-05-26 22:24:56.484877	\N	\N	\N	\N	P. Højbjerg	\N	https://media.api-sports.io/football/players/2735.png
47438	\N	2026-05-26 22:24:56.490685	436	2026-05-26 22:24:56.491209	\N	\N	\N	\N	M. Jensen	\N	https://media.api-sports.io/football/players/47438.png
15884	\N	2026-05-26 22:24:56.496626	437	2026-05-26 22:24:56.496626	\N	\N	\N	\N	J. Lindstrøm	\N	https://media.api-sports.io/football/players/15884.png
361352	\N	2026-05-26 22:24:56.50313	438	2026-05-26 22:24:56.50313	\N	\N	\N	\N	N. Nartey	\N	https://media.api-sports.io/football/players/361352.png
30407	\N	2026-05-26 22:24:56.508385	439	2026-05-26 22:24:56.508385	\N	\N	\N	\N	C. Nørgaard	\N	https://media.api-sports.io/football/players/30407.png
45017	\N	2026-05-26 22:24:56.515901	440	2026-05-26 22:24:56.5159	\N	\N	\N	\N	A. Dreyer	\N	https://media.api-sports.io/football/players/45017.png
15704	\N	2026-05-26 22:24:56.521902	441	2026-05-26 22:24:56.521902	\N	\N	\N	\N	K. Høgh	\N	https://media.api-sports.io/football/players/15704.png
288006	\N	2026-05-26 22:24:56.527902	442	2026-05-26 22:24:56.527901	\N	\N	\N	\N	R. Højlund	\N	https://media.api-sports.io/football/players/288006.png
135519	\N	2026-05-26 22:24:56.533901	443	2026-05-26 22:24:56.533901	\N	\N	\N	\N	G. Isaksen	\N	https://media.api-sports.io/football/players/135519.png
315237	\N	2026-05-26 22:24:56.539903	444	2026-05-26 22:24:56.539902	\N	\N	\N	\N	W. Osula	\N	https://media.api-sports.io/football/players/315237.png
2682	\N	2026-05-26 22:25:28.078021	445	2026-05-26 22:25:28.078021	\N	\N	\N	\N	A. Beiranvand	\N	https://media.api-sports.io/football/players/2682.png
29755	\N	2026-05-26 22:25:28.083237	446	2026-05-26 22:25:28.083236	\N	\N	\N	\N	H. Hosseini	\N	https://media.api-sports.io/football/players/29755.png
2681	\N	2026-05-26 22:25:28.087537	447	2026-05-26 22:25:28.087536	\N	\N	\N	\N	P. Niazmand	\N	https://media.api-sports.io/football/players/2681.png
532925	\N	2026-05-26 22:25:28.091579	448	2026-05-26 22:25:28.091578	\N	\N	\N	\N	A. Abdullayev	\N	https://media.api-sports.io/football/players/532925.png
341844	\N	2026-05-26 22:25:28.096577	449	2026-05-26 22:25:28.096577	\N	\N	\N	\N	M. Ghorbani	\N	https://media.api-sports.io/football/players/341844.png
2685	\N	2026-05-26 22:25:28.101576	450	2026-05-26 22:25:28.102576	\N	\N	\N	\N	E. Hajisafi	\N	https://media.api-sports.io/football/players/2685.png
136880	\N	2026-05-26 22:25:28.105576	451	2026-05-26 22:25:28.105575	\N	\N	\N	\N	Saleh Hardani	\N	https://media.api-sports.io/football/players/136880.png
2687	\N	2026-05-26 22:25:28.110576	452	2026-05-26 22:25:28.110575	\N	\N	\N	\N	H. Kanani	\N	https://media.api-sports.io/football/players/2687.png
29704	\N	2026-05-26 22:25:28.113576	453	2026-05-26 22:25:28.113575	\N	\N	\N	\N	S. Khalilzadeh	\N	https://media.api-sports.io/football/players/29704.png
2688	\N	2026-05-26 22:25:28.118577	454	2026-05-26 22:25:28.118577	\N	\N	\N	\N	M. Mohammadi	\N	https://media.api-sports.io/football/players/2688.png
533035	\N	2026-05-26 22:25:28.122576	455	2026-05-26 22:25:28.122575	\N	\N	\N	\N	A. Nemati	\N	https://media.api-sports.io/football/players/533035.png
2691	\N	2026-05-26 22:25:28.126579	456	2026-05-26 22:25:28.126579	\N	\N	\N	\N	R. Rezaeian	\N	https://media.api-sports.io/football/players/2691.png
343405	\N	2026-05-26 22:25:28.130576	457	2026-05-26 22:25:28.130575	\N	\N	\N	\N	A. Yousefi	\N	https://media.api-sports.io/football/players/343405.png
2699	\N	2026-05-26 22:25:28.135576	458	2026-05-26 22:25:28.135575	\N	\N	\N	\N	S. Ghoddos	\N	https://media.api-sports.io/football/players/2699.png
8564	\N	2026-05-26 22:25:28.139576	459	2026-05-26 22:25:28.139575	\N	\N	\N	\N	A. Gholizadeh	\N	https://media.api-sports.io/football/players/8564.png
29775	\N	2026-05-26 22:25:28.143577	460	2026-05-26 22:25:28.143576	\N	\N	\N	\N	O. Noorafkan	\N	https://media.api-sports.io/football/players/29775.png
423753	\N	2026-05-26 22:25:28.147576	461	2026-05-26 22:25:28.147575	\N	\N	\N	\N	A. Razzaghinia	\N	https://media.api-sports.io/football/players/423753.png
29720	\N	2026-05-26 22:25:28.152577	462	2026-05-26 22:25:28.152576	\N	\N	\N	\N	A. Alipour	\N	https://media.api-sports.io/football/players/29720.png
357029	\N	2026-05-26 22:25:28.156576	463	2026-05-26 22:25:28.156575	\N	\N	\N	\N	M. Hashemnejad	\N	https://media.api-sports.io/football/players/357029.png
29937	\N	2026-05-26 22:25:28.160576	464	2026-05-26 22:25:28.160575	\N	\N	\N	\N	A. Hosseinzadeh	\N	https://media.api-sports.io/football/players/29937.png
2700	\N	2026-05-26 22:25:28.165576	465	2026-05-26 22:25:28.165575	\N	\N	\N	\N	A. Jahanbakhsh	\N	https://media.api-sports.io/football/players/2700.png
613145	\N	2026-05-26 22:25:28.169578	466	2026-05-26 22:25:28.169577	\N	\N	\N	\N	A. Mahmoudi	\N	https://media.api-sports.io/football/players/613145.png
89982	\N	2026-05-26 22:25:28.173579	467	2026-05-26 22:25:28.173578	\N	\N	\N	\N	S. Moghanlou	\N	https://media.api-sports.io/football/players/89982.png
134217	\N	2026-05-26 22:25:28.177576	468	2026-05-26 22:25:28.177576	\N	\N	\N	\N	M. Mohebi	\N	https://media.api-sports.io/football/players/134217.png
42315	\N	2026-05-26 22:25:28.181577	469	2026-05-26 22:25:28.181576	\N	\N	\N	\N	M. Taremi	\N	https://media.api-sports.io/football/players/42315.png
193288	\N	2026-05-26 22:25:28.185576	470	2026-05-26 22:25:28.186576	\N	\N	\N	\N	Nawaf Al Aqidi	\N	https://media.api-sports.io/football/players/193288.png
44449	\N	2026-05-26 22:25:28.190577	471	2026-05-26 22:25:28.190576	\N	\N	\N	\N	Ahmed Al Kassar	\N	https://media.api-sports.io/football/players/44449.png
44360	\N	2026-05-26 22:25:28.195576	472	2026-05-26 22:25:28.195576	\N	\N	\N	\N	Raghed Najjar	\N	https://media.api-sports.io/football/players/44360.png
44411	\N	2026-05-26 22:25:28.201578	473	2026-05-26 22:25:28.201578	\N	\N	\N	\N	Mohammed Al Owais	\N	https://media.api-sports.io/football/players/44411.png
543009	\N	2026-05-26 22:25:28.205577	474	2026-05-26 22:25:28.205576	\N	\N	\N	\N	M. Al Rubaie	\N	https://media.api-sports.io/football/players/543009.png
310827	\N	2026-05-26 22:25:28.210578	475	2026-05-26 22:25:28.210578	\N	\N	\N	\N	Abdulrahman Al Sanbi	\N	https://media.api-sports.io/football/players/310827.png
44594	\N	2026-05-26 22:25:28.215578	476	2026-05-26 22:25:28.215578	\N	\N	\N	\N	Saud Abdulhamid	\N	https://media.api-sports.io/football/players/44594.png
134995	\N	2026-05-26 22:25:28.220576	477	2026-05-26 22:25:28.220576	\N	\N	\N	\N	Nawaf Boushal	\N	https://media.api-sports.io/football/players/134995.png
44337	\N	2026-05-26 22:25:28.226576	478	2026-05-26 22:25:28.226575	\N	\N	\N	\N	Waleed Al Ahmad	\N	https://media.api-sports.io/football/players/44337.png
44475	\N	2026-05-26 22:25:28.232576	479	2026-05-26 22:25:28.232576	\N	\N	\N	\N	Abdulelah Al Amri	\N	https://media.api-sports.io/football/players/44475.png
44684	\N	2026-05-26 22:25:28.237577	480	2026-05-26 22:25:28.237577	\N	\N	\N	\N	Khalifah Al Dawsari	\N	https://media.api-sports.io/football/players/44684.png
2628	\N	2026-05-26 22:25:28.242577	481	2026-05-26 22:25:28.242577	\N	\N	\N	\N	Muteb Al Mufarrij	\N	https://media.api-sports.io/football/players/2628.png
363310	\N	2026-05-26 22:25:28.247576	482	2026-05-26 22:25:28.247576	\N	\N	\N	\N	Mohammed Essa Harbush	\N	https://media.api-sports.io/football/players/363310.png
542829	\N	2026-05-26 22:25:28.251578	483	2026-05-26 22:25:28.251577	\N	\N	\N	\N	R. Hamidou	\N	https://media.api-sports.io/football/players/542829.png
44335	\N	2026-05-26 22:25:28.255579	484	2026-05-26 22:25:28.255578	\N	\N	\N	\N	Hassan Kadesh	\N	https://media.api-sports.io/football/players/44335.png
44507	\N	2026-05-26 22:25:28.260576	485	2026-05-26 22:25:28.260576	\N	\N	\N	\N	Ali Lajami	\N	https://media.api-sports.io/football/players/44507.png
44367	\N	2026-05-26 22:25:28.264576	486	2026-05-26 22:25:28.264575	\N	\N	\N	\N	Ali Majrashi	\N	https://media.api-sports.io/football/players/44367.png
369413	\N	2026-05-26 22:25:28.268577	487	2026-05-26 22:25:28.268577	\N	\N	\N	\N	Mohammed Bakor	\N	https://media.api-sports.io/football/players/369413.png
44362	\N	2026-05-26 22:25:28.272576	488	2026-05-26 22:25:28.272575	\N	\N	\N	\N	Hassan Tambakti	\N	https://media.api-sports.io/football/players/44362.png
543059	\N	2026-05-26 22:25:28.277577	489	2026-05-26 22:25:28.277576	\N	\N	\N	\N	J. Thakri	\N	https://media.api-sports.io/football/players/543059.png
403087	\N	2026-05-26 22:25:28.282577	490	2026-05-26 22:25:28.282576	\N	\N	\N	\N	Mohammed Abu Al Shamat	\N	https://media.api-sports.io/football/players/403087.png
312652	\N	2026-05-26 22:25:28.286575	491	2026-05-26 22:25:28.286575	\N	\N	\N	\N	Waheb Saleh	\N	https://media.api-sports.io/football/players/312652.png
44374	\N	2026-05-26 22:25:28.291578	492	2026-05-26 22:25:28.291577	\N	\N	\N	\N	Turki Al Ammar	\N	https://media.api-sports.io/football/players/44374.png
44339	\N	2026-05-26 22:25:28.296577	493	2026-05-26 22:25:28.296577	\N	\N	\N	\N	Nasser Al Dawsari	\N	https://media.api-sports.io/football/players/44339.png
44340	\N	2026-05-26 22:25:28.301576	494	2026-05-26 22:25:28.301576	\N	\N	\N	\N	Salem Al Dawsari	\N	https://media.api-sports.io/football/players/44340.png
44341	\N	2026-05-26 22:25:28.305576	495	2026-05-26 22:25:28.305576	\N	\N	\N	\N	Salman Al Faraj	\N	https://media.api-sports.io/football/players/44341.png
442343	\N	2026-05-26 22:25:28.310577	496	2026-05-26 22:25:28.310577	\N	\N	\N	\N	Murad Al Hawsawi	\N	https://media.api-sports.io/football/players/442343.png
269172	\N	2026-05-26 22:25:28.314576	497	2026-05-26 22:25:28.314576	\N	\N	\N	\N	Ziyad Al Johani	\N	https://media.api-sports.io/football/players/269172.png
306380	\N	2026-05-26 22:25:28.319576	498	2026-05-26 22:25:28.319576	\N	\N	\N	\N	Musab Al Juwayr	\N	https://media.api-sports.io/football/players/306380.png
44315	\N	2026-05-26 22:25:28.323578	499	2026-05-26 22:25:28.323577	\N	\N	\N	\N	Abdullah Al Khaibari	\N	https://media.api-sports.io/football/players/44315.png
44510	\N	2026-05-26 22:25:28.327576	500	2026-05-26 22:25:28.327576	\N	\N	\N	\N	Mohammed Al-Majhad	\N	https://media.api-sports.io/football/players/44510.png
44349	\N	2026-05-26 22:25:28.331576	501	2026-05-26 22:25:28.331575	\N	\N	\N	\N	Mohamed Kanno	\N	https://media.api-sports.io/football/players/44349.png
326984	\N	2026-05-26 22:25:28.335576	502	2026-05-26 22:25:28.335576	\N	\N	\N	\N	Mohammed Mater Mohsin Mahzari	\N	https://media.api-sports.io/football/players/326984.png
578970	\N	2026-05-26 22:25:28.340578	503	2026-05-26 22:25:28.340577	\N	\N	\N	\N	N. Masoud	\N	https://media.api-sports.io/football/players/578970.png
578901	\N	2026-05-26 22:25:28.344576	504	2026-05-26 22:25:28.344575	\N	\N	\N	\N	A. S. Al Aliwa	\N	https://media.api-sports.io/football/players/578901.png
44324	\N	2026-05-26 22:25:28.348576	505	2026-05-26 22:25:28.348576	\N	\N	\N	\N	Feras Al Brikan	\N	https://media.api-sports.io/football/players/44324.png
44701	\N	2026-05-26 22:25:28.356578	506	2026-05-26 22:25:28.356577	\N	\N	\N	\N	Khalid Al Ghannam	\N	https://media.api-sports.io/football/players/44701.png
44382	\N	2026-05-26 22:25:28.361576	507	2026-05-26 22:25:28.361575	\N	\N	\N	\N	Abdullah Al Hamdan	\N	https://media.api-sports.io/football/players/44382.png
44586	\N	2026-05-26 22:25:28.366577	508	2026-05-26 22:25:28.366576	\N	\N	\N	\N	Abdulrahman Al Obud	\N	https://media.api-sports.io/football/players/44586.png
381176	\N	2026-05-26 22:25:28.372576	509	2026-05-26 22:25:28.372576	\N	\N	\N	\N	Marwan Al Sahafi	\N	https://media.api-sports.io/football/players/381176.png
44551	\N	2026-05-26 22:25:28.376576	510	2026-05-26 22:25:28.376576	\N	\N	\N	\N	Saleh Al Shehri	\N	https://media.api-sports.io/football/players/44551.png
2639	\N	2026-05-26 22:25:28.379576	511	2026-05-26 22:25:28.379576	\N	\N	\N	\N	Sultan Mandash	\N	https://media.api-sports.io/football/players/2639.png
147812	\N	2026-05-26 22:25:28.384577	512	2026-05-26 22:25:28.384576	\N	\N	\N	\N	Ayman Yahya	\N	https://media.api-sports.io/football/players/147812.png
31035	\N	2026-05-26 22:25:28.388579	513	2026-05-26 22:25:28.388578	\N	\N	\N	\N	B. Drągowski	\N	https://media.api-sports.io/football/players/31035.png
15573	\N	2026-05-26 22:25:28.393579	514	2026-05-26 22:25:28.393578	\N	\N	\N	\N	K. Grabara	\N	https://media.api-sports.io/football/players/15573.png
128640	\N	2026-05-26 22:25:28.397577	515	2026-05-26 22:25:28.397576	\N	\N	\N	\N	M. Kochalski	\N	https://media.api-sports.io/football/players/128640.png
2998	\N	2026-05-26 22:25:28.403577	516	2026-05-26 22:25:28.403577	\N	\N	\N	\N	Ł. Skorupski	\N	https://media.api-sports.io/football/players/2998.png
286551	\N	2026-05-26 22:25:28.409579	517	2026-05-26 22:25:28.409578	\N	\N	\N	\N	K. Tobiasz	\N	https://media.api-sports.io/football/players/286551.png
2999	\N	2026-05-26 22:25:28.416576	518	2026-05-26 22:25:28.416575	\N	\N	\N	\N	J. Bednarek	\N	https://media.api-sports.io/football/players/2999.png
3000	\N	2026-05-26 22:25:28.421577	519	2026-05-26 22:25:28.421576	\N	\N	\N	\N	B. Bereszyński	\N	https://media.api-sports.io/football/players/3000.png
19298	\N	2026-05-26 22:25:28.426577	520	2026-05-26 22:25:28.426576	\N	\N	\N	\N	M. Cash	\N	https://media.api-sports.io/football/players/19298.png
3007	\N	2026-05-26 22:25:28.431576	521	2026-05-26 22:25:28.431576	\N	\N	\N	\N	P. Frankowski	\N	https://media.api-sports.io/football/players/3007.png
2164	\N	2026-05-26 22:25:28.436579	522	2026-05-26 22:25:28.436578	\N	\N	\N	\N	T. Kędziora	\N	https://media.api-sports.io/football/players/2164.png
61431	\N	2026-05-26 22:25:28.440576	523	2026-05-26 22:25:28.440576	\N	\N	\N	\N	J. Kiwior	\N	https://media.api-sports.io/football/players/61431.png
207212	\N	2026-05-26 22:25:28.444576	524	2026-05-26 22:25:28.444575	\N	\N	\N	\N	K. Szcześniak	\N	https://media.api-sports.io/football/players/207212.png
40231	\N	2026-05-26 22:25:28.449576	525	2026-05-26 22:25:28.449575	\N	\N	\N	\N	P. Wiśniewski	\N	https://media.api-sports.io/football/players/40231.png
384543	\N	2026-05-26 22:25:28.453576	526	2026-05-26 22:25:28.453576	\N	\N	\N	\N	J. Ziółkowski	\N	https://media.api-sports.io/football/players/384543.png
40560	\N	2026-05-26 22:25:28.457576	527	2026-05-26 22:25:28.457576	\N	\N	\N	\N	J. Kamiński	\N	https://media.api-sports.io/football/players/40560.png
8782	\N	2026-05-26 22:25:28.461576	528	2026-05-26 22:25:28.461576	\N	\N	\N	\N	B. Kapustka	\N	https://media.api-sports.io/football/players/8782.png
64304	\N	2026-05-26 22:25:28.464579	529	2026-05-26 22:25:28.464578	\N	\N	\N	\N	K. Kozłowski	\N	https://media.api-sports.io/football/players/64304.png
40911	\N	2026-05-26 22:25:28.468576	530	2026-05-26 22:25:28.468576	\N	\N	\N	\N	J. Moder	\N	https://media.api-sports.io/football/players/40911.png
1939	\N	2026-05-26 22:25:28.472576	531	2026-05-26 22:25:28.472575	\N	\N	\N	\N	J. Piotrowski	\N	https://media.api-sports.io/football/players/1939.png
148448	\N	2026-05-26 22:25:28.476578	532	2026-05-26 22:25:28.476577	\N	\N	\N	\N	A. Pyrka	\N	https://media.api-sports.io/football/players/148448.png
394955	\N	2026-05-26 22:25:28.481576	533	2026-05-26 22:25:28.481576	\N	\N	\N	\N	F. Rózga	\N	https://media.api-sports.io/football/players/394955.png
40534	\N	2026-05-26 22:25:28.484576	534	2026-05-26 22:25:28.485575	\N	\N	\N	\N	B. Slisz	\N	https://media.api-sports.io/football/players/40534.png
40403	\N	2026-05-26 22:25:28.489576	535	2026-05-26 22:25:28.489576	\N	\N	\N	\N	S. Szymański	\N	https://media.api-sports.io/football/players/40403.png
19591	\N	2026-05-26 22:25:28.496578	536	2026-05-26 22:25:28.496578	\N	\N	\N	\N	P. Wszołek	\N	https://media.api-sports.io/football/players/19591.png
203474	\N	2026-05-26 22:25:28.501577	537	2026-05-26 22:25:28.501576	\N	\N	\N	\N	N. Zalewski	\N	https://media.api-sports.io/football/players/203474.png
329	\N	2026-05-26 22:25:28.505578	538	2026-05-26 22:25:28.505578	\N	\N	\N	\N	P. Zieliński	\N	https://media.api-sports.io/football/players/329.png
40594	\N	2026-05-26 22:25:28.510577	539	2026-05-26 22:25:28.510576	\N	\N	\N	\N	A. Buksa	\N	https://media.api-sports.io/football/players/40594.png
3012	\N	2026-05-26 22:25:28.514579	540	2026-05-26 22:25:28.515576	\N	\N	\N	\N	K. Grosicki	\N	https://media.api-sports.io/football/players/3012.png
521	\N	2026-05-26 22:25:28.519576	541	2026-05-26 22:25:28.519575	\N	\N	\N	\N	R. Lewandowski	\N	https://media.api-sports.io/football/players/521.png
1651	\N	2026-05-26 22:25:28.524577	542	2026-05-26 22:25:28.524576	\N	\N	\N	\N	K. Piątek	\N	https://media.api-sports.io/football/players/1651.png
442540	\N	2026-05-26 22:25:28.530575	543	2026-05-26 22:25:28.530575	\N	\N	\N	\N	O. Pietuszewski	\N	https://media.api-sports.io/football/players/442540.png
40809	\N	2026-05-26 22:25:28.534576	544	2026-05-26 22:25:28.534575	\N	\N	\N	\N	M. Skóraś	\N	https://media.api-sports.io/football/players/40809.png
2385	\N	2026-05-26 22:25:28.539578	545	2026-05-26 22:25:28.539577	\N	\N	\N	\N	K. Świderski	\N	https://media.api-sports.io/football/players/2385.png
702	\N	2026-05-26 22:25:28.544577	546	2026-05-26 22:25:28.544576	\N	\N	\N	\N	O. Baumann	\N	https://media.api-sports.io/football/players/702.png
25903	\N	2026-05-26 22:25:28.549576	547	2026-05-26 22:25:28.549575	\N	\N	\N	\N	F. Dahmen	\N	https://media.api-sports.io/football/players/25903.png
399	\N	2026-05-26 22:25:28.555578	548	2026-05-26 22:25:28.555577	\N	\N	\N	\N	A. Nübel	\N	https://media.api-sports.io/football/players/399.png
25368	\N	2026-05-26 22:25:28.562578	549	2026-05-26 22:25:28.562577	\N	\N	\N	\N	W. Anton	\N	https://media.api-sports.io/football/players/25368.png
280074	\N	2026-05-26 22:25:28.569578	550	2026-05-26 22:25:28.569578	\N	\N	\N	\N	N. Brown	\N	https://media.api-sports.io/football/players/280074.png
25158	\N	2026-05-26 22:25:28.575576	551	2026-05-26 22:25:28.575576	\N	\N	\N	\N	D. Raum	\N	https://media.api-sports.io/football/players/25158.png
2285	\N	2026-05-26 22:25:28.580576	552	2026-05-26 22:25:28.580575	\N	\N	\N	\N	A. Rüdiger	\N	https://media.api-sports.io/football/players/2285.png
26243	\N	2026-05-26 22:25:28.584576	553	2026-05-26 22:25:28.585576	\N	\N	\N	\N	N. Schlotterbeck	\N	https://media.api-sports.io/football/players/26243.png
972	\N	2026-05-26 22:25:28.594947	554	2026-05-26 22:25:28.594947	\N	\N	\N	\N	J. Tah	\N	https://media.api-sports.io/football/players/972.png
163189	\N	2026-05-26 22:25:28.598662	555	2026-05-26 22:25:28.59919	\N	\N	\N	\N	M. Thiaw	\N	https://media.api-sports.io/football/players/163189.png
24868	\N	2026-05-26 22:25:28.604498	556	2026-05-26 22:25:28.604497	\N	\N	\N	\N	J. Vagnoman	\N	https://media.api-sports.io/football/players/24868.png
511	\N	2026-05-26 22:25:28.610401	557	2026-05-26 22:25:28.610401	\N	\N	\N	\N	L. Goretzka	\N	https://media.api-sports.io/football/players/511.png
18970	\N	2026-05-26 22:25:28.616815	558	2026-05-26 22:25:28.616815	\N	\N	\N	\N	P. Groß	\N	https://media.api-sports.io/football/players/18970.png
494131	\N	2026-05-26 22:25:28.622053	559	2026-05-26 22:25:28.622053	\N	\N	\N	\N	L. Karl	\N	https://media.api-sports.io/football/players/494131.png
502	\N	2026-05-26 22:25:28.627315	560	2026-05-26 22:25:28.627315	\N	\N	\N	\N	J. Kimmich	\N	https://media.api-sports.io/football/players/502.png
178077	\N	2026-05-26 22:25:28.63381	561	2026-05-26 22:25:28.63381	\N	\N	\N	\N	K. Schade	\N	https://media.api-sports.io/football/players/178077.png
177665	\N	2026-05-26 22:25:28.639086	562	2026-05-26 22:25:28.639085	\N	\N	\N	\N	A. Stach	\N	https://media.api-sports.io/football/players/177665.png
137210	\N	2026-05-26 22:25:28.643813	563	2026-05-26 22:25:28.643812	\N	\N	\N	\N	A. Stiller	\N	https://media.api-sports.io/football/players/137210.png
203224	\N	2026-05-26 22:25:28.648656	564	2026-05-26 22:25:28.648656	\N	\N	\N	\N	F. Wirtz	\N	https://media.api-sports.io/football/players/203224.png
24798	\N	2026-05-26 22:25:28.653587	565	2026-05-26 22:25:28.653586	\N	\N	\N	\N	C. Führich	\N	https://media.api-sports.io/football/players/24798.png
510	\N	2026-05-26 22:25:28.657266	566	2026-05-26 22:25:28.657266	\N	\N	\N	\N	S. Gnabry	\N	https://media.api-sports.io/football/players/510.png
978	\N	2026-05-26 22:25:28.661552	567	2026-05-26 22:25:28.661551	\N	\N	\N	\N	K. Havertz	\N	https://media.api-sports.io/football/players/978.png
644	\N	2026-05-26 22:25:28.666908	568	2026-05-26 22:25:28.666907	\N	\N	\N	\N	L. Sané	\N	https://media.api-sports.io/football/players/644.png
26475	\N	2026-05-26 22:25:28.671168	569	2026-05-26 22:25:28.671167	\N	\N	\N	\N	D. Undav	\N	https://media.api-sports.io/football/players/26475.png
158054	\N	2026-05-26 22:25:28.67537	570	2026-05-26 22:25:28.675369	\N	\N	\N	\N	N. Woltemade	\N	https://media.api-sports.io/football/players/158054.png
19599	\N	2026-05-26 22:25:28.68074	571	2026-05-26 22:25:28.680739	\N	\N	\N	\N	E. Martínez	\N	https://media.api-sports.io/football/players/19599.png
2465	\N	2026-05-26 22:25:28.685493	572	2026-05-26 22:25:28.685493	\N	\N	\N	\N	J. Musso	\N	https://media.api-sports.io/football/players/2465.png
47296	\N	2026-05-26 22:25:28.690815	573	2026-05-26 22:25:28.690814	\N	\N	\N	\N	G. Rulli	\N	https://media.api-sports.io/football/players/47296.png
1493	\N	2026-05-26 22:25:28.69764	574	2026-05-26 22:25:28.697639	\N	\N	\N	\N	M. Acuña	\N	https://media.api-sports.io/football/players/1493.png
306706	\N	2026-05-26 22:25:28.702902	575	2026-05-26 22:25:28.703432	\N	\N	\N	\N	A. Giay	\N	https://media.api-sports.io/football/players/306706.png
6000	\N	2026-05-26 22:25:28.708289	576	2026-05-26 22:25:28.708288	\N	\N	\N	\N	L. Martínez	\N	https://media.api-sports.io/football/players/6000.png
6503	\N	2026-05-26 22:25:28.714078	577	2026-05-26 22:25:28.714078	\N	\N	\N	\N	N. Molina	\N	https://media.api-sports.io/football/players/6503.png
624	\N	2026-05-26 22:25:28.718835	578	2026-05-26 22:25:28.718835	\N	\N	\N	\N	N. Otamendi	\N	https://media.api-sports.io/football/players/624.png
6608	\N	2026-05-26 22:25:28.724761	579	2026-05-26 22:25:28.72476	\N	\N	\N	\N	G. Rojas	\N	https://media.api-sports.io/football/players/6608.png
30776	\N	2026-05-26 22:25:28.731312	580	2026-05-26 22:25:28.731311	\N	\N	\N	\N	C. Romero	\N	https://media.api-sports.io/football/players/30776.png
6610	\N	2026-05-26 22:25:28.738409	581	2026-05-26 22:25:28.738409	\N	\N	\N	\N	M. Senesi	\N	https://media.api-sports.io/football/players/6610.png
529	\N	2026-05-26 22:25:28.744821	582	2026-05-26 22:25:28.744821	\N	\N	\N	\N	N. Tagliafico	\N	https://media.api-sports.io/football/players/529.png
319572	\N	2026-05-26 22:25:28.750603	583	2026-05-26 22:25:28.750602	\N	\N	\N	\N	V. Barco	\N	https://media.api-sports.io/football/players/319572.png
5996	\N	2026-05-26 22:25:28.756059	584	2026-05-26 22:25:28.756059	\N	\N	\N	\N	E. Fernández	\N	https://media.api-sports.io/football/players/5996.png
6716	\N	2026-05-26 22:25:28.760268	585	2026-05-26 22:25:28.760267	\N	\N	\N	\N	A. Mac Allister	\N	https://media.api-sports.io/football/players/6716.png
6002	\N	2026-05-26 22:25:28.764358	586	2026-05-26 22:25:28.764358	\N	\N	\N	\N	E. Palacios	\N	https://media.api-sports.io/football/players/6002.png
271	\N	2026-05-26 22:25:28.769194	587	2026-05-26 22:25:28.769194	\N	\N	\N	\N	L. Paredes	\N	https://media.api-sports.io/football/players/271.png
350037	\N	2026-05-26 22:25:28.774466	588	2026-05-26 22:25:28.774465	\N	\N	\N	\N	N. Paz	\N	https://media.api-sports.io/football/players/350037.png
288699	\N	2026-05-26 22:25:28.779236	589	2026-05-26 22:25:28.779235	\N	\N	\N	\N	M. Perrone	\N	https://media.api-sports.io/football/players/288699.png
2472	\N	2026-05-26 22:25:28.783634	590	2026-05-26 22:25:28.784161	\N	\N	\N	\N	R. De Paul	\N	https://media.api-sports.io/football/players/2472.png
6067	\N	2026-05-26 22:25:28.788899	591	2026-05-26 22:25:28.789427	\N	\N	\N	\N	T. Almada	\N	https://media.api-sports.io/football/players/6067.png
6009	\N	2026-05-26 22:25:28.79472	592	2026-05-26 22:25:28.79472	\N	\N	\N	\N	J. Álvarez	\N	https://media.api-sports.io/football/players/6009.png
26315	\N	2026-05-26 22:25:28.80006	593	2026-05-26 22:25:28.800059	\N	\N	\N	\N	N. González	\N	https://media.api-sports.io/football/players/26315.png
295513	\N	2026-05-26 22:25:28.805836	594	2026-05-26 22:25:28.805835	\N	\N	\N	\N	J. López	\N	https://media.api-sports.io/football/players/295513.png
449249	\N	2026-05-26 22:25:28.811634	595	2026-05-26 22:25:28.811633	\N	\N	\N	\N	Franco Mastantuono	\N	https://media.api-sports.io/football/players/449249.png
154	\N	2026-05-26 22:25:28.819207	596	2026-05-26 22:25:28.819207	\N	\N	\N	\N	L. Messi	\N	https://media.api-sports.io/football/players/154.png
362755	\N	2026-05-26 22:25:28.833031	597	2026-05-26 22:25:28.83303	\N	\N	\N	\N	G. Prestianni	\N	https://media.api-sports.io/football/players/362755.png
323935	\N	2026-05-26 22:25:28.840972	598	2026-05-26 22:25:28.840972	\N	\N	\N	\N	G. Simeone	\N	https://media.api-sports.io/football/players/323935.png
1590	\N	2026-05-26 22:26:00.352419	599	2026-05-26 22:26:00.352418	\N	\N	\N	\N	José Sá	\N	https://media.api-sports.io/football/players/1590.png
46672	\N	2026-05-26 22:26:00.358176	600	2026-05-26 22:26:00.358175	\N	\N	\N	\N	Rui Silva	\N	https://media.api-sports.io/football/players/46672.png
41960	\N	2026-05-26 22:26:00.362864	601	2026-05-26 22:26:00.362873	\N	\N	\N	\N	Ricardo Velho	\N	https://media.api-sports.io/football/players/41960.png
161939	\N	2026-05-26 22:26:00.366534	602	2026-05-26 22:26:00.366534	\N	\N	\N	\N	Tomás Araújo	\N	https://media.api-sports.io/football/players/161939.png
855	\N	2026-05-26 22:26:00.370858	603	2026-05-26 22:26:00.370857	\N	\N	\N	\N	João Cancelo	\N	https://media.api-sports.io/football/players/855.png
886	\N	2026-05-26 22:26:00.374671	604	2026-05-26 22:26:00.374671	\N	\N	\N	\N	Diogo Dalot	\N	https://media.api-sports.io/football/players/886.png
265595	\N	2026-05-26 22:26:00.378837	605	2026-05-26 22:26:00.378837	\N	\N	\N	\N	Gonçalo Inácio	\N	https://media.api-sports.io/football/players/265595.png
263482	\N	2026-05-26 22:26:00.383211	606	2026-05-26 22:26:00.383211	\N	\N	\N	\N	Nuno Mendes	\N	https://media.api-sports.io/football/players/263482.png
331832	\N	2026-05-26 22:26:00.388468	607	2026-05-26 22:26:00.388468	\N	\N	\N	\N	António Silva	\N	https://media.api-sports.io/football/players/331832.png
336671	\N	2026-05-26 22:26:00.392847	608	2026-05-26 22:26:00.392846	\N	\N	\N	\N	Renato Veiga	\N	https://media.api-sports.io/football/players/336671.png
1485	\N	2026-05-26 22:26:00.397028	609	2026-05-26 22:26:00.397028	\N	\N	\N	\N	Bruno Fernandes	\N	https://media.api-sports.io/football/players/1485.png
336585	\N	2026-05-26 22:26:00.401309	610	2026-05-26 22:26:00.401309	\N	\N	\N	\N	Mateus Fernandes	\N	https://media.api-sports.io/football/players/336585.png
335051	\N	2026-05-26 22:26:00.406033	611	2026-05-26 22:26:00.406033	\N	\N	\N	\N	João Neves	\N	https://media.api-sports.io/football/players/335051.png
2676	\N	2026-05-26 22:26:00.410281	612	2026-05-26 22:26:00.41028	\N	\N	\N	\N	Rúben Neves	\N	https://media.api-sports.io/football/players/2676.png
41621	\N	2026-05-26 22:26:00.414607	613	2026-05-26 22:26:00.414607	\N	\N	\N	\N	Matheus Nunes	\N	https://media.api-sports.io/football/players/41621.png
18748	\N	2026-05-26 22:26:00.418804	614	2026-05-26 22:26:00.418804	\N	\N	\N	\N	Pote	\N	https://media.api-sports.io/football/players/18748.png
190485	\N	2026-05-26 22:26:00.422421	615	2026-05-26 22:26:00.422421	\N	\N	\N	\N	Samú Costa	\N	https://media.api-sports.io/football/players/190485.png
128384	\N	2026-05-26 22:26:00.426422	616	2026-05-26 22:26:00.426421	\N	\N	\N	\N	Vitinha	\N	https://media.api-sports.io/football/players/128384.png
161585	\N	2026-05-26 22:26:00.431418	617	2026-05-26 22:26:00.431418	\N	\N	\N	\N	Francisco Conceição	\N	https://media.api-sports.io/football/players/161585.png
925	\N	2026-05-26 22:26:00.435421	618	2026-05-26 22:26:00.43542	\N	\N	\N	\N	Gonçalo Guedes	\N	https://media.api-sports.io/football/players/925.png
41103	\N	2026-05-26 22:26:00.439058	619	2026-05-26 22:26:00.439588	\N	\N	\N	\N	Ricardo Horta	\N	https://media.api-sports.io/football/players/41103.png
583	\N	2026-05-26 22:26:00.44325	620	2026-05-26 22:26:00.443249	\N	\N	\N	\N	João Félix	\N	https://media.api-sports.io/football/players/583.png
1864	\N	2026-05-26 22:26:00.448132	621	2026-05-26 22:26:00.448132	\N	\N	\N	\N	Pedro Neto	\N	https://media.api-sports.io/football/players/1864.png
41111	\N	2026-05-26 22:26:00.452846	622	2026-05-26 22:26:00.452846	\N	\N	\N	\N	Paulinho	\N	https://media.api-sports.io/football/players/41111.png
41585	\N	2026-05-26 22:26:00.457073	623	2026-05-26 22:26:00.457072	\N	\N	\N	\N	Gonçalo Ramos	\N	https://media.api-sports.io/football/players/41585.png
41112	\N	2026-05-26 22:26:00.461972	624	2026-05-26 22:26:00.461972	\N	\N	\N	\N	Trincão	\N	https://media.api-sports.io/football/players/41112.png
49423	\N	2026-05-26 22:26:00.466748	625	2026-05-26 22:26:00.466748	\N	\N	\N	\N	S. Ben Hsan	\N	https://media.api-sports.io/football/players/49423.png
533394	\N	2026-05-26 22:26:00.472002	626	2026-05-26 22:26:00.472002	\N	\N	\N	\N	C. Abdelmouhib	\N	https://media.api-sports.io/football/players/533394.png
49424	\N	2026-05-26 22:26:00.476292	627	2026-05-26 22:26:00.476816	\N	\N	\N	\N	A. Dahmen	\N	https://media.api-sports.io/football/players/49424.png
49583	\N	2026-05-26 22:26:00.481007	628	2026-05-26 22:26:00.481006	\N	\N	\N	\N	A. Abdi	\N	https://media.api-sports.io/football/players/49583.png
393977	\N	2026-05-26 22:26:00.484677	629	2026-05-26 22:26:00.484677	\N	\N	\N	\N	A. Arous	\N	https://media.api-sports.io/football/players/393977.png
135059	\N	2026-05-26 22:26:00.489423	630	2026-05-26 22:26:00.489423	\N	\N	\N	\N	A. Ben Hmida	\N	https://media.api-sports.io/football/players/135059.png
2945	\N	2026-05-26 22:26:00.494885	631	2026-05-26 22:26:00.494884	\N	\N	\N	\N	D. Bronn	\N	https://media.api-sports.io/football/players/2945.png
533360	\N	2026-05-26 22:26:00.498591	632	2026-05-26 22:26:00.49859	\N	\N	\N	\N	R. Chikhaoui	\N	https://media.api-sports.io/football/players/533360.png
375608	\N	2026-05-26 22:26:00.502287	633	2026-05-26 22:26:00.502286	\N	\N	\N	\N	M. Neffati	\N	https://media.api-sports.io/football/players/375608.png
163068	\N	2026-05-26 22:26:00.506581	634	2026-05-26 22:26:00.50658	\N	\N	\N	\N	O. Rekik	\N	https://media.api-sports.io/football/players/163068.png
50030	\N	2026-05-26 22:26:00.510778	635	2026-05-26 22:26:00.510777	\N	\N	\N	\N	M. Talbi	\N	https://media.api-sports.io/football/players/50030.png
18942	\N	2026-05-26 22:26:00.515493	636	2026-05-26 22:26:00.515493	\N	\N	\N	\N	Y. Valery	\N	https://media.api-sports.io/football/players/18942.png
67195	\N	2026-05-26 22:26:00.519676	637	2026-05-26 22:26:00.519686	\N	\N	\N	\N	H. Mahmoud	\N	https://media.api-sports.io/football/players/67195.png
49469	\N	2026-05-26 22:26:00.523978	638	2026-05-26 22:26:00.523978	\N	\N	\N	\N	M. Ben Ouanes	\N	https://media.api-sports.io/football/players/49469.png
310196	\N	2026-05-26 22:26:00.528189	639	2026-05-26 22:26:00.528188	\N	\N	\N	\N	Ismaël Gharbi	\N	https://media.api-sports.io/football/players/310196.png
25300	\N	2026-05-26 22:26:00.532414	640	2026-05-26 22:26:00.532414	\N	\N	\N	\N	R. Khedira	\N	https://media.api-sports.io/football/players/25300.png
180560	\N	2026-05-26 22:26:00.537323	641	2026-05-26 22:26:00.537323	\N	\N	\N	\N	H. Mejbri	\N	https://media.api-sports.io/football/players/180560.png
21587	\N	2026-05-26 22:26:00.542077	642	2026-05-26 22:26:00.542077	\N	\N	\N	\N	E. Skhiri	\N	https://media.api-sports.io/football/players/21587.png
199310	\N	2026-05-26 22:26:00.546825	643	2026-05-26 22:26:00.546824	\N	\N	\N	\N	A. Ben Slimane	\N	https://media.api-sports.io/football/players/199310.png
42012	\N	2026-05-26 22:26:00.551151	644	2026-05-26 22:26:00.55115	\N	\N	\N	\N	E. Achouri	\N	https://media.api-sports.io/football/players/42012.png
533295	\N	2026-05-26 22:26:00.55536	645	2026-05-26 22:26:00.55536	\N	\N	\N	\N	K. Ayari	\N	https://media.api-sports.io/football/players/533295.png
2962	\N	2026-05-26 22:26:00.559559	646	2026-05-26 22:26:00.559558	\N	\N	\N	\N	F. Chaouat	\N	https://media.api-sports.io/football/players/2962.png
566059	\N	2026-05-26 22:26:00.563509	647	2026-05-26 22:26:00.563509	\N	\N	\N	\N	R. Elloumi	\N	https://media.api-sports.io/football/players/566059.png
344862	\N	2026-05-26 22:26:00.567734	648	2026-05-26 22:26:00.567734	\N	\N	\N	\N	H. Mastouri	\N	https://media.api-sports.io/football/players/344862.png
323974	\N	2026-05-26 22:26:00.573094	649	2026-05-26 22:26:00.573093	\N	\N	\N	\N	E. Saad	\N	https://media.api-sports.io/football/players/323974.png
57518	\N	2026-05-26 22:26:00.576796	650	2026-05-26 22:26:00.576795	\N	\N	\N	\N	S. Tounekti	\N	https://media.api-sports.io/football/players/57518.png
14198	\N	2026-05-26 22:26:00.580991	651	2026-05-26 22:26:00.58099	\N	\N	\N	\N	K. Chamorro	\N	https://media.api-sports.io/football/players/14198.png
297901	\N	2026-05-26 22:26:00.58584	652	2026-05-26 22:26:00.585839	\N	\N	\N	\N	A. Madríz	\N	https://media.api-sports.io/football/players/297901.png
731	\N	2026-05-26 22:26:00.590049	653	2026-05-26 22:26:00.590049	\N	\N	\N	\N	K. Navas	\N	https://media.api-sports.io/football/players/731.png
135148	\N	2026-05-26 22:26:00.59532	654	2026-05-26 22:26:00.595319	\N	\N	\N	\N	P. Sequeira	\N	https://media.api-sports.io/football/players/135148.png
194757	\N	2026-05-26 22:26:00.60032	655	2026-05-26 22:26:00.600319	\N	\N	\N	\N	J. Azofeifa	\N	https://media.api-sports.io/football/players/194757.png
2830	\N	2026-05-26 22:26:00.604534	656	2026-05-26 22:26:00.604533	\N	\N	\N	\N	F. Calvo	\N	https://media.api-sports.io/football/players/2830.png
51224	\N	2026-05-26 22:26:00.609282	657	2026-05-26 22:26:00.609282	\N	\N	\N	\N	J. Cascante	\N	https://media.api-sports.io/football/players/51224.png
14104	\N	2026-05-26 22:26:00.61391	658	2026-05-26 22:26:00.61391	\N	\N	\N	\N	F. Faerrón	\N	https://media.api-sports.io/football/players/14104.png
14106	\N	2026-05-26 22:26:00.61791	659	2026-05-26 22:26:00.61791	\N	\N	\N	\N	D. López	\N	https://media.api-sports.io/football/players/14106.png
297583	\N	2026-05-26 22:26:00.62291	660	2026-05-26 22:26:00.62291	\N	\N	\N	\N	J. Mitchell	\N	https://media.api-sports.io/football/players/297583.png
50758	\N	2026-05-26 22:26:00.62837	661	2026-05-26 22:26:00.628369	\N	\N	\N	\N	J. Mora	\N	https://media.api-sports.io/football/players/50758.png
13860	\N	2026-05-26 22:26:00.634739	662	2026-05-26 22:26:00.634739	\N	\N	\N	\N	A. Salazar	\N	https://media.api-sports.io/football/players/13860.png
352350	\N	2026-05-26 22:26:00.639976	663	2026-05-26 22:26:00.639975	\N	\N	\N	\N	G. Taylor	\N	https://media.api-sports.io/football/players/352350.png
2836	\N	2026-05-26 22:26:00.64648	664	2026-05-26 22:26:00.64648	\N	\N	\N	\N	J. Vargas	\N	https://media.api-sports.io/football/players/2836.png
324115	\N	2026-05-26 22:26:00.652461	665	2026-05-26 22:26:00.652461	\N	\N	\N	\N	G. Villalobos	\N	https://media.api-sports.io/football/players/324115.png
2837	\N	2026-05-26 22:26:00.657704	666	2026-05-26 22:26:00.658243	\N	\N	\N	\N	K. Waston	\N	https://media.api-sports.io/football/players/2837.png
308198	\N	2026-05-26 22:26:00.664102	667	2026-05-26 22:26:00.664102	\N	\N	\N	\N	S. van der Putten	\N	https://media.api-sports.io/football/players/308198.png
323942	\N	2026-05-26 22:26:00.669353	668	2026-05-26 22:26:00.669353	\N	\N	\N	\N	J. Alcócer	\N	https://media.api-sports.io/football/players/323942.png
79696	\N	2026-05-26 22:26:00.674821	669	2026-05-26 22:26:00.674821	\N	\N	\N	\N	D. Araya	\N	https://media.api-sports.io/football/players/79696.png
2840	\N	2026-05-26 22:26:00.680586	670	2026-05-26 22:26:00.680585	\N	\N	\N	\N	C. Borges	\N	https://media.api-sports.io/football/players/2840.png
297397	\N	2026-05-26 22:26:00.685324	671	2026-05-26 22:26:00.685324	\N	\N	\N	\N	A. Bran	\N	https://media.api-sports.io/football/players/297397.png
14146	\N	2026-05-26 22:26:00.692055	672	2026-05-26 22:26:00.692054	\N	\N	\N	\N	J. Brenes	\N	https://media.api-sports.io/football/players/14146.png
13937	\N	2026-05-26 22:26:00.698393	673	2026-05-26 22:26:00.698913	\N	\N	\N	\N	O. Galo	\N	https://media.api-sports.io/football/players/13937.png
8720	\N	2026-05-26 22:26:00.703757	674	2026-05-26 22:26:00.703757	\N	\N	\N	\N	A. Gamboa	\N	https://media.api-sports.io/football/players/8720.png
79686	\N	2026-05-26 22:26:00.709036	675	2026-05-26 22:26:00.709036	\N	\N	\N	\N	A. Murillo	\N	https://media.api-sports.io/football/players/79686.png
270487	\N	2026-05-26 22:26:00.716454	676	2026-05-26 22:26:00.716454	\N	\N	\N	\N	H. Quirós	\N	https://media.api-sports.io/football/players/270487.png
196254	\N	2026-05-26 22:26:00.723127	677	2026-05-26 22:26:00.723127	\N	\N	\N	\N	Á. Zamora	\N	https://media.api-sports.io/football/players/196254.png
2845	\N	2026-05-26 22:26:00.735312	678	2026-05-26 22:26:00.735312	\N	\N	\N	\N	J. Campbell	\N	https://media.api-sports.io/football/players/2845.png
541224	\N	2026-05-26 22:26:00.741104	679	2026-05-26 22:26:00.741103	\N	\N	\N	\N	A. Hernandez	\N	https://media.api-sports.io/football/players/541224.png
270498	\N	2026-05-26 22:26:00.74584	680	2026-05-26 22:26:00.74584	\N	\N	\N	\N	W. Madrigal	\N	https://media.api-sports.io/football/players/270498.png
79678	\N	2026-05-26 22:26:00.750794	681	2026-05-26 22:26:00.750793	\N	\N	\N	\N	A. Martínez	\N	https://media.api-sports.io/football/players/79678.png
196480	\N	2026-05-26 22:26:00.763515	682	2026-05-26 22:26:00.763515	\N	\N	\N	\N	C. Mora	\N	https://media.api-sports.io/football/players/196480.png
350872	\N	2026-05-26 22:26:00.768515	683	2026-05-26 22:26:00.768514	\N	\N	\N	\N	C. Pérez	\N	https://media.api-sports.io/football/players/350872.png
385727	\N	2026-05-26 22:26:00.772515	684	2026-05-26 22:26:00.772515	\N	\N	\N	\N	A. Rojas	\N	https://media.api-sports.io/football/players/385727.png
13863	\N	2026-05-26 22:26:00.776518	685	2026-05-26 22:26:00.776517	\N	\N	\N	\N	A. Soto	\N	https://media.api-sports.io/football/players/13863.png
13898	\N	2026-05-26 22:26:00.780518	686	2026-05-26 22:26:00.780517	\N	\N	\N	\N	M. Ugalde	\N	https://media.api-sports.io/football/players/13898.png
306578	\N	2026-05-26 22:26:00.785515	687	2026-05-26 22:26:00.785514	\N	\N	\N	\N	K. Vargas	\N	https://media.api-sports.io/football/players/306578.png
294290	\N	2026-05-26 22:26:00.789516	688	2026-05-26 22:26:00.789515	\N	\N	\N	\N	M. Harrar	\N	https://media.api-sports.io/football/players/294290.png
144879	\N	2026-05-26 22:26:00.795514	689	2026-05-26 22:26:00.795514	\N	\N	\N	\N	M. Benabid	\N	https://media.api-sports.io/football/players/144879.png
2701	\N	2026-05-26 22:26:00.801515	690	2026-05-26 22:26:00.801514	\N	\N	\N	\N	Y. Bounou	\N	https://media.api-sports.io/football/players/2701.png
2702	\N	2026-05-26 22:26:00.806515	691	2026-05-26 22:26:00.806514	\N	\N	\N	\N	M. Mohamedi	\N	https://media.api-sports.io/football/players/2702.png
21694	\N	2026-05-26 22:26:00.810516	692	2026-05-26 22:26:00.810515	\N	\N	\N	\N	N. Aguerd	\N	https://media.api-sports.io/football/players/21694.png
417830	\N	2026-05-26 22:26:00.816517	693	2026-05-26 22:26:00.816517	\N	\N	\N	\N	A. Ait Boudlal	\N	https://media.api-sports.io/football/players/417830.png
396198	\N	2026-05-26 22:26:00.826514	694	2026-05-26 22:26:00.826514	\N	\N	\N	\N	I. Baouf	\N	https://media.api-sports.io/football/players/396198.png
194572	\N	2026-05-26 22:26:00.832515	695	2026-05-26 22:26:00.832515	\N	\N	\N	\N	M. Chibi	\N	https://media.api-sports.io/football/players/194572.png
18814	\N	2026-05-26 22:26:00.837517	696	2026-05-26 22:26:00.837516	\N	\N	\N	\N	I. Diop	\N	https://media.api-sports.io/football/players/18814.png
127803	\N	2026-05-26 22:26:00.843515	697	2026-05-26 22:26:00.843515	\N	\N	\N	\N	S. El Karouani	\N	https://media.api-sports.io/football/players/127803.png
283252	\N	2026-05-26 22:26:00.849515	698	2026-05-26 22:26:00.849515	\N	\N	\N	\N	Z. El Ouahdi	\N	https://media.api-sports.io/football/players/283252.png
31386	\N	2026-05-26 22:26:00.855515	699	2026-05-26 22:26:00.855515	\N	\N	\N	\N	J. El Yamiq	\N	https://media.api-sports.io/football/players/31386.png
9	\N	2026-05-26 22:26:00.860515	700	2026-05-26 22:26:00.860514	\N	\N	\N	\N	A. Hakimi	\N	https://media.api-sports.io/football/players/9.png
326183	\N	2026-05-26 22:26:00.864515	701	2026-05-26 22:26:00.864515	\N	\N	\N	\N	R. Halhal	\N	https://media.api-sports.io/football/players/326183.png
545	\N	2026-05-26 22:26:00.869515	702	2026-05-26 22:26:00.869515	\N	\N	\N	\N	N. Mazraoui	\N	https://media.api-sports.io/football/players/545.png
278898	\N	2026-05-26 22:26:00.873518	703	2026-05-26 22:26:00.873517	\N	\N	\N	\N	C. Riad	\N	https://media.api-sports.io/football/players/278898.png
162451	\N	2026-05-26 22:26:00.879514	704	2026-05-26 22:26:00.879514	\N	\N	\N	\N	A. Salah-Eddine	\N	https://media.api-sports.io/football/players/162451.png
129682	\N	2026-05-26 22:26:00.883518	705	2026-05-26 22:26:00.884517	\N	\N	\N	\N	A. Adli	\N	https://media.api-sports.io/football/players/129682.png
74	\N	2026-05-26 22:26:00.888516	706	2026-05-26 22:26:00.888516	\N	\N	\N	\N	S. Amrabat	\N	https://media.api-sports.io/football/players/74.png
146772	\N	2026-05-26 22:26:00.893516	707	2026-05-26 22:26:00.893516	\N	\N	\N	\N	Y. Belammari	\N	https://media.api-sports.io/football/players/146772.png
396202	\N	2026-05-26 22:26:00.897518	708	2026-05-26 22:26:00.897517	\N	\N	\N	\N	Rayane Bounida	\N	https://media.api-sports.io/football/players/396202.png
744	\N	2026-05-26 22:26:00.902518	709	2026-05-26 22:26:00.902517	\N	\N	\N	\N	Brahim Díaz	\N	https://media.api-sports.io/football/players/744.png
277003	\N	2026-05-26 22:26:00.907517	710	2026-05-26 22:26:00.907516	\N	\N	\N	\N	N. El Aynaoui	\N	https://media.api-sports.io/football/players/277003.png
340573	\N	2026-05-26 22:26:00.912516	711	2026-05-26 22:26:00.912516	\N	\N	\N	\N	B. El Khannouss	\N	https://media.api-sports.io/football/players/340573.png
415431	\N	2026-05-26 22:26:00.916516	712	2026-05-26 22:26:00.916515	\N	\N	\N	\N	S. El Mourabet	\N	https://media.api-sports.io/football/players/415431.png
146771	\N	2026-05-26 22:26:00.921516	713	2026-05-26 22:26:00.921515	\N	\N	\N	\N	M. Hrimat	\N	https://media.api-sports.io/football/players/146771.png
129678	\N	2026-05-26 22:26:00.93174	714	2026-05-26 22:26:00.93174	\N	\N	\N	\N	A. Ounahi	\N	https://media.api-sports.io/football/players/129678.png
161897	\N	2026-05-26 22:26:00.936971	715	2026-05-26 22:26:00.936971	\N	\N	\N	\N	I. Saibari	\N	https://media.api-sports.io/football/players/161897.png
284071	\N	2026-05-26 22:26:00.942927	716	2026-05-26 22:26:00.942926	\N	\N	\N	\N	O. Targhalline	\N	https://media.api-sports.io/football/players/284071.png
369544	\N	2026-05-26 22:26:00.948166	717	2026-05-26 22:26:00.948166	\N	\N	\N	\N	Gessime Yassine	\N	https://media.api-sports.io/football/players/369544.png
290740	\N	2026-05-26 22:26:00.952884	718	2026-05-26 22:26:00.952884	\N	\N	\N	\N	Ilias Akhomach	\N	https://media.api-sports.io/football/players/290740.png
343320	\N	2026-05-26 22:26:00.959337	719	2026-05-26 22:26:00.959337	\N	\N	\N	\N	E. Ben Seghir	\N	https://media.api-sports.io/football/players/343320.png
2722	\N	2026-05-26 22:26:00.964972	720	2026-05-26 22:26:00.964972	\N	\N	\N	\N	A. El Kaabi	\N	https://media.api-sports.io/football/players/2722.png
47422	\N	2026-05-26 22:26:00.969974	721	2026-05-26 22:26:00.969973	\N	\N	\N	\N	Y. En-Nesyri	\N	https://media.api-sports.io/football/players/47422.png
181421	\N	2026-05-26 22:26:00.974975	722	2026-05-26 22:26:00.974974	\N	\N	\N	\N	A. Ezzalzouli	\N	https://media.api-sports.io/football/players/181421.png
306979	\N	2026-05-26 22:26:00.979973	723	2026-05-26 22:26:00.979973	\N	\N	\N	\N	H. Igamane	\N	https://media.api-sports.io/football/players/306979.png
36579	\N	2026-05-26 22:26:00.983975	724	2026-05-26 22:26:00.983975	\N	\N	\N	\N	S. Rahimi	\N	https://media.api-sports.io/football/players/36579.png
336659	\N	2026-05-26 22:26:00.991492	725	2026-05-26 22:26:00.991491	\N	\N	\N	\N	C. Talbi	\N	https://media.api-sports.io/football/players/336659.png
457101	\N	2026-05-26 22:26:00.996494	726	2026-05-26 22:26:00.996493	\N	\N	\N	\N	M. Zabiri	\N	https://media.api-sports.io/football/players/457101.png
18885	\N	2026-05-26 22:26:01.002492	727	2026-05-26 22:26:01.002492	\N	\N	\N	\N	K. Darlow	\N	https://media.api-sports.io/football/players/18885.png
19779	\N	2026-05-26 22:26:01.006491	728	2026-05-26 22:26:01.006491	\N	\N	\N	\N	A. Davies	\N	https://media.api-sports.io/football/players/19779.png
82855	\N	2026-05-26 22:26:01.010491	729	2026-05-26 22:26:01.01049	\N	\N	\N	\N	T. King	\N	https://media.api-sports.io/football/players/82855.png
18146	\N	2026-05-26 22:26:01.014493	730	2026-05-26 22:26:01.014493	\N	\N	\N	\N	D. Ward	\N	https://media.api-sports.io/football/players/18146.png
2279	\N	2026-05-26 22:26:01.019491	731	2026-05-26 22:26:01.01949	\N	\N	\N	\N	E. Ampadu	\N	https://media.api-sports.io/football/players/2279.png
104041	\N	2026-05-26 22:26:01.022494	732	2026-05-26 22:26:01.022493	\N	\N	\N	\N	B. Cabango	\N	https://media.api-sports.io/football/players/104041.png
19260	\N	2026-05-26 22:26:01.026493	733	2026-05-26 22:26:01.026493	\N	\N	\N	\N	J. Dasilva	\N	https://media.api-sports.io/football/players/19260.png
164	\N	2026-05-26 22:26:01.03049	734	2026-05-26 22:26:01.03049	\N	\N	\N	\N	B. Davies	\N	https://media.api-sports.io/football/players/164.png
394902	\N	2026-05-26 22:26:01.034491	735	2026-05-26 22:26:01.03449	\N	\N	\N	\N	R. Kpakio	\N	https://media.api-sports.io/football/players/394902.png
394973	\N	2026-05-26 22:26:01.037493	736	2026-05-26 22:26:01.037493	\N	\N	\N	\N	D. Lawlor	\N	https://media.api-sports.io/football/players/394973.png
18866	\N	2026-05-26 22:26:01.041896	737	2026-05-26 22:26:01.041895	\N	\N	\N	\N	C. Mepham	\N	https://media.api-sports.io/football/players/18866.png
18331	\N	2026-05-26 22:26:01.046094	738	2026-05-26 22:26:01.046102	\N	\N	\N	\N	R. Norrington-Davies	\N	https://media.api-sports.io/football/players/18331.png
19321	\N	2026-05-26 22:26:01.049808	739	2026-05-26 22:26:01.049808	\N	\N	\N	\N	J. Rodon	\N	https://media.api-sports.io/football/players/19321.png
138780	\N	2026-05-26 22:26:01.053992	740	2026-05-26 22:26:01.053991	\N	\N	\N	\N	N. Williams	\N	https://media.api-sports.io/football/players/138780.png
126791	\N	2026-05-26 22:26:01.057679	741	2026-05-26 22:26:01.057679	\N	\N	\N	\N	N. Broadhead	\N	https://media.api-sports.io/football/players/126791.png
379621	\N	2026-05-26 22:26:01.061355	742	2026-05-26 22:26:01.061354	\N	\N	\N	\N	J. Colwill	\N	https://media.api-sports.io/football/players/379621.png
301184	\N	2026-05-26 22:26:01.065674	743	2026-05-26 22:26:01.065674	\N	\N	\N	\N	R. Colwill	\N	https://media.api-sports.io/football/players/301184.png
19329	\N	2026-05-26 22:26:01.069508	744	2026-05-26 22:26:01.069508	\N	\N	\N	\N	D. James	\N	https://media.api-sports.io/football/players/19329.png
328074	\N	2026-05-26 22:26:01.073187	745	2026-05-26 22:26:01.073186	\N	\N	\N	\N	J. James	\N	https://media.api-sports.io/football/players/328074.png
82034	\N	2026-05-26 22:26:01.077491	746	2026-05-26 22:26:01.07749	\N	\N	\N	\N	J. Sheehan	\N	https://media.api-sports.io/football/players/82034.png
19221	\N	2026-05-26 22:26:01.081692	747	2026-05-26 22:26:01.081691	\N	\N	\N	\N	H. Wilson	\N	https://media.api-sports.io/football/players/19221.png
18870	\N	2026-05-26 22:26:01.085904	748	2026-05-26 22:26:01.085903	\N	\N	\N	\N	D. Brooks	\N	https://media.api-sports.io/football/players/18870.png
19335	\N	2026-05-26 22:26:01.090172	749	2026-05-26 22:26:01.090172	\N	\N	\N	\N	L. Cullen	\N	https://media.api-sports.io/football/players/19335.png
17932	\N	2026-05-26 22:26:01.095021	750	2026-05-26 22:26:01.095021	\N	\N	\N	\N	M. Harris	\N	https://media.api-sports.io/football/players/17932.png
129711	\N	2026-05-26 22:26:01.100821	751	2026-05-26 22:26:01.10082	\N	\N	\N	\N	B. Johnson	\N	https://media.api-sports.io/football/players/129711.png
328107	\N	2026-05-26 22:26:01.105028	752	2026-05-26 22:26:01.105554	\N	\N	\N	\N	L. Koumas	\N	https://media.api-sports.io/football/players/328107.png
19804	\N	2026-05-26 22:26:01.110758	753	2026-05-26 22:26:01.110757	\N	\N	\N	\N	K. Moore	\N	https://media.api-sports.io/football/players/19804.png
18599	\N	2026-05-26 22:26:01.115498	754	2026-05-26 22:26:01.115497	\N	\N	\N	\N	S. Thomas	\N	https://media.api-sports.io/football/players/18599.png
37137	\N	2026-05-26 22:26:32.628318	755	2026-05-26 22:26:32.628841	\N	\N	\N	\N	J. Bijlow	\N	https://media.api-sports.io/football/players/37137.png
26232	\N	2026-05-26 22:26:32.63415	756	2026-05-26 22:26:32.634149	\N	\N	\N	\N	M. Flekken	\N	https://media.api-sports.io/football/players/26232.png
129058	\N	2026-05-26 22:26:32.638337	757	2026-05-26 22:26:32.638336	\N	\N	\N	\N	B. Verbruggen	\N	https://media.api-sports.io/football/players/129058.png
18861	\N	2026-05-26 22:26:32.643044	758	2026-05-26 22:26:32.643044	\N	\N	\N	\N	N. Aké	\N	https://media.api-sports.io/football/players/18861.png
226	\N	2026-05-26 22:26:32.647985	759	2026-05-26 22:26:32.647985	\N	\N	\N	\N	D. Dumfries	\N	https://media.api-sports.io/football/players/226.png
37143	\N	2026-05-26 22:26:32.652171	760	2026-05-26 22:26:32.652171	\N	\N	\N	\N	L. Geertruida	\N	https://media.api-sports.io/football/players/37143.png
341642	\N	2026-05-26 22:26:32.656357	761	2026-05-26 22:26:32.656356	\N	\N	\N	\N	J. Hato	\N	https://media.api-sports.io/football/players/341642.png
194	\N	2026-05-26 22:26:32.661183	762	2026-05-26 22:26:32.661183	\N	\N	\N	\N	S. de Vrij	\N	https://media.api-sports.io/football/players/194.png
290	\N	2026-05-26 22:26:32.665457	763	2026-05-26 22:26:32.665456	\N	\N	\N	\N	V. van Dijk	\N	https://media.api-sports.io/football/players/290.png
38695	\N	2026-05-26 22:26:32.669128	764	2026-05-26 22:26:32.669128	\N	\N	\N	\N	J. van Hecke	\N	https://media.api-sports.io/football/players/38695.png
152849	\N	2026-05-26 22:26:32.673296	765	2026-05-26 22:26:32.673295	\N	\N	\N	\N	M. van de Ven	\N	https://media.api-sports.io/football/players/152849.png
152654	\N	2026-05-26 22:26:32.677533	766	2026-05-26 22:26:32.677532	\N	\N	\N	\N	J. Frimpong	\N	https://media.api-sports.io/football/players/152654.png
542	\N	2026-05-26 22:26:32.684532	767	2026-05-26 22:26:32.684531	\N	\N	\N	\N	R. Gravenberch	\N	https://media.api-sports.io/football/players/542.png
36899	\N	2026-05-26 22:26:32.688536	768	2026-05-26 22:26:32.688535	\N	\N	\N	\N	T. Koopmeiners	\N	https://media.api-sports.io/football/players/36899.png
36902	\N	2026-05-26 22:26:32.69432	769	2026-05-26 22:26:32.694319	\N	\N	\N	\N	T. Reijnders	\N	https://media.api-sports.io/football/players/36902.png
37890	\N	2026-05-26 22:26:32.698515	770	2026-05-26 22:26:32.698515	\N	\N	\N	\N	J. Schouten	\N	https://media.api-sports.io/football/players/37890.png
162016	\N	2026-05-26 22:26:32.702189	771	2026-05-26 22:26:32.702189	\N	\N	\N	\N	X. Simons	\N	https://media.api-sports.io/football/players/162016.png
388786	\N	2026-05-26 22:26:32.706439	772	2026-05-26 22:26:32.706439	\N	\N	\N	\N	K. Smit	\N	https://media.api-sports.io/football/players/388786.png
38747	\N	2026-05-26 22:26:32.710229	773	2026-05-26 22:26:32.710228	\N	\N	\N	\N	Q. Timber	\N	https://media.api-sports.io/football/players/38747.png
314266	\N	2026-05-26 22:26:32.714406	774	2026-05-26 22:26:32.714406	\N	\N	\N	\N	L. Valente	\N	https://media.api-sports.io/football/players/314266.png
38750	\N	2026-05-26 22:26:32.718078	775	2026-05-26 22:26:32.718078	\N	\N	\N	\N	B. Brobbey	\N	https://media.api-sports.io/football/players/38750.png
247	\N	2026-05-26 22:26:32.723055	776	2026-05-26 22:26:32.723055	\N	\N	\N	\N	C. Gakpo	\N	https://media.api-sports.io/football/players/247.png
544	\N	2026-05-26 22:26:32.727233	777	2026-05-26 22:26:32.727233	\N	\N	\N	\N	N. Lang	\N	https://media.api-sports.io/football/players/544.png
249	\N	2026-05-26 22:26:32.731937	778	2026-05-26 22:26:32.731936	\N	\N	\N	\N	D. Malen	\N	https://media.api-sports.io/football/players/249.png
25416	\N	2026-05-26 22:26:32.736731	779	2026-05-26 22:26:32.736778	\N	\N	\N	\N	W. Weghorst	\N	https://media.api-sports.io/football/players/25416.png
144709	\N	2026-05-26 22:26:32.740969	780	2026-05-26 22:26:32.740968	\N	\N	\N	\N	J. Anang	\N	https://media.api-sports.io/football/players/144709.png
559233	\N	2026-05-26 22:26:32.745171	781	2026-05-26 22:26:32.74517	\N	\N	\N	\N	S. Mohan	\N	https://media.api-sports.io/football/players/559233.png
3412	\N	2026-05-26 22:26:32.749897	782	2026-05-26 22:26:32.749897	\N	\N	\N	\N	L. Zigi	\N	https://media.api-sports.io/football/players/3412.png
369425	\N	2026-05-26 22:26:32.754784	783	2026-05-26 22:26:32.754783	\N	\N	\N	\N	J. Adjetey	\N	https://media.api-sports.io/football/players/369425.png
305450	\N	2026-05-26 22:26:32.758926	784	2026-05-26 22:26:32.758926	\N	\N	\N	\N	E. Annan	\N	https://media.api-sports.io/football/players/305450.png
21633	\N	2026-05-26 22:26:32.763666	785	2026-05-26 22:26:32.763665	\N	\N	\N	\N	A. Djiku	\N	https://media.api-sports.io/football/players/21633.png
128853	\N	2026-05-26 22:26:32.768107	786	2026-05-26 22:26:32.768107	\N	\N	\N	\N	D. Köhn	\N	https://media.api-sports.io/football/players/128853.png
25341	\N	2026-05-26 22:26:32.773414	787	2026-05-26 22:26:32.773414	\N	\N	\N	\N	D. Luckassen	\N	https://media.api-sports.io/football/players/25341.png
7578	\N	2026-05-26 22:26:32.778131	788	2026-05-26 22:26:32.77813	\N	\N	\N	\N	G. Mensah	\N	https://media.api-sports.io/football/players/7578.png
137223	\N	2026-05-26 22:26:32.781822	789	2026-05-26 22:26:32.781822	\N	\N	\N	\N	J. Opoku	\N	https://media.api-sports.io/football/players/137223.png
404172	\N	2026-05-26 22:26:32.786921	790	2026-05-26 22:26:32.78692	\N	\N	\N	\N	K. Peprah Oppong	\N	https://media.api-sports.io/football/players/404172.png
108475	\N	2026-05-26 22:26:32.791432	791	2026-05-26 22:26:32.791432	\N	\N	\N	\N	P. Pfeiffer	\N	https://media.api-sports.io/football/players/108475.png
191240	\N	2026-05-26 22:26:32.796394	792	2026-05-26 22:26:32.796394	\N	\N	\N	\N	M. Senaya	\N	https://media.api-sports.io/football/players/191240.png
21010	\N	2026-05-26 22:26:32.802843	793	2026-05-26 22:26:32.802843	\N	\N	\N	\N	E. Owusu	\N	https://media.api-sports.io/football/players/21010.png
49	\N	2026-05-26 22:26:32.80809	794	2026-05-26 22:26:32.80809	\N	\N	\N	\N	T. Partey	\N	https://media.api-sports.io/football/players/49.png
3608	\N	2026-05-26 22:26:32.814063	795	2026-05-26 22:26:32.814063	\N	\N	\N	\N	K. Sibo	\N	https://media.api-sports.io/football/players/3608.png
353609	\N	2026-05-26 22:26:32.823641	796	2026-05-26 22:26:32.823641	\N	\N	\N	\N	I. Sulemana	\N	https://media.api-sports.io/football/players/353609.png
475575	\N	2026-05-26 22:26:32.831679	797	2026-05-26 22:26:32.831678	\N	\N	\N	\N	Caleb Marfo Yirenkyi	\N	https://media.api-sports.io/football/players/475575.png
410016	\N	2026-05-26 22:26:32.83612	798	2026-05-26 22:26:32.836119	\N	\N	\N	\N	P. Adu	\N	https://media.api-sports.io/football/players/410016.png
87791	\N	2026-05-26 22:26:32.840841	799	2026-05-26 22:26:32.840841	\N	\N	\N	\N	D. Agyei	\N	https://media.api-sports.io/football/players/87791.png
3428	\N	2026-05-26 22:26:32.845144	800	2026-05-26 22:26:32.845144	\N	\N	\N	\N	J. Ayew	\N	https://media.api-sports.io/football/players/3428.png
411800	\N	2026-05-26 22:26:32.849874	801	2026-05-26 22:26:32.849874	\N	\N	\N	\N	C. Bonsu Baah	\N	https://media.api-sports.io/football/players/411800.png
303467	\N	2026-05-26 22:26:32.854224	802	2026-05-26 22:26:32.854224	\N	\N	\N	\N	A. Fatawu	\N	https://media.api-sports.io/football/players/303467.png
162773	\N	2026-05-26 22:26:32.858412	803	2026-05-26 22:26:32.858412	\N	\N	\N	\N	R. Königsdörffer	\N	https://media.api-sports.io/football/players/162773.png
19281	\N	2026-05-26 22:26:32.863228	804	2026-05-26 22:26:32.863228	\N	\N	\N	\N	A. Semenyo	\N	https://media.api-sports.io/football/players/19281.png
199837	\N	2026-05-26 22:26:32.867405	805	2026-05-26 22:26:32.867405	\N	\N	\N	\N	K. Sulemana	\N	https://media.api-sports.io/football/players/199837.png
26940	\N	2026-05-26 22:26:32.871596	806	2026-05-26 22:26:32.871596	\N	\N	\N	\N	D. Epassy	\N	https://media.api-sports.io/football/players/26940.png
145060	\N	2026-05-26 22:26:32.875469	807	2026-05-26 22:26:32.875975	\N	\N	\N	\N	S. Ngapandouetnbu	\N	https://media.api-sports.io/football/players/145060.png
265712	\N	2026-05-26 22:26:32.88073	808	2026-05-26 22:26:32.880729	\N	\N	\N	\N	Blondy Rudolph Nna Noukeu	\N	https://media.api-sports.io/football/players/265712.png
650728	\N	2026-05-26 22:26:32.883811	809	2026-05-26 22:26:32.883811	\N	\N	\N	\N	H. Ousmanou	\N	https://media.api-sports.io/football/players/650728.png
650726	\N	2026-05-26 22:26:32.888329	810	2026-05-26 22:26:32.888328	\N	\N	\N	\N	S. Eloundou	\N	https://media.api-sports.io/football/players/650726.png
277056	\N	2026-05-26 22:26:32.892327	811	2026-05-26 22:26:32.892327	\N	\N	\N	\N	O. Kamdem	\N	https://media.api-sports.io/football/players/277056.png
302622	\N	2026-05-26 22:26:32.898398	812	2026-05-26 22:26:32.898398	\N	\N	\N	\N	K. Keben	\N	https://media.api-sports.io/football/players/302622.png
561386	\N	2026-05-26 22:26:32.903681	813	2026-05-26 22:26:32.903681	\N	\N	\N	\N	S. Keller	\N	https://media.api-sports.io/football/players/561386.png
303118	\N	2026-05-26 22:26:32.908528	814	2026-05-26 22:26:32.908527	\N	\N	\N	\N	S. Kotto	\N	https://media.api-sports.io/football/players/303118.png
341290	\N	2026-05-26 22:26:32.913262	815	2026-05-26 22:26:32.913262	\N	\N	\N	\N	C. Malone	\N	https://media.api-sports.io/football/players/341290.png
489292	\N	2026-05-26 22:26:32.91746	816	2026-05-26 22:26:32.917978	\N	\N	\N	\N	E. Moungam	\N	https://media.api-sports.io/football/players/489292.png
438281	\N	2026-05-26 22:26:32.923391	817	2026-05-26 22:26:32.923391	\N	\N	\N	\N	M. Nagida	\N	https://media.api-sports.io/football/players/438281.png
152669	\N	2026-05-26 22:26:32.929209	818	2026-05-26 22:26:32.929208	\N	\N	\N	\N	D. Yongwa	\N	https://media.api-sports.io/football/players/152669.png
303108	\N	2026-05-26 22:26:32.933942	819	2026-05-26 22:26:32.933941	\N	\N	\N	\N	F. Ambina	\N	https://media.api-sports.io/football/players/303108.png
402265	\N	2026-05-26 22:26:32.938273	820	2026-05-26 22:26:32.938273	\N	\N	\N	\N	A. Avom	\N	https://media.api-sports.io/football/players/402265.png
335069	\N	2026-05-26 22:26:32.943554	821	2026-05-26 22:26:32.943554	\N	\N	\N	\N	R. Fosso	\N	https://media.api-sports.io/football/players/335069.png
396330	\N	2026-05-26 22:26:32.947235	822	2026-05-26 22:26:32.947234	\N	\N	\N	\N	Arnold Mael Kamdem	\N	https://media.api-sports.io/football/players/396330.png
637629	\N	2026-05-26 22:26:32.951518	823	2026-05-26 22:26:32.951518	\N	\N	\N	\N	F. Monyebe	\N	https://media.api-sports.io/football/players/637629.png
650727	\N	2026-05-26 22:26:32.955289	824	2026-05-26 22:26:32.955795	\N	\N	\N	\N	K. Nifanso	\N	https://media.api-sports.io/football/players/650727.png
378284	\N	2026-05-26 22:26:32.959444	825	2026-05-26 22:26:32.96044	\N	\N	\N	\N	Etta Eyong	\N	https://media.api-sports.io/football/players/378284.png
505295	\N	2026-05-26 22:26:32.963962	826	2026-05-26 22:26:32.963961	\N	\N	\N	\N	Christian Kofane	\N	https://media.api-sports.io/football/players/505295.png
20589	\N	2026-05-26 22:26:32.968961	827	2026-05-26 22:26:32.96896	\N	\N	\N	\N	B. Mbeumo	\N	https://media.api-sports.io/football/players/20589.png
19625	\N	2026-05-26 22:26:32.973964	828	2026-05-26 22:26:32.973963	\N	\N	\N	\N	D. Namaso	\N	https://media.api-sports.io/football/players/19625.png
296560	\N	2026-05-26 22:26:32.978961	829	2026-05-26 22:26:32.97896	\N	\N	\N	\N	J. Tchatchoua	\N	https://media.api-sports.io/football/players/296560.png
630702	\N	2026-05-26 22:26:32.981964	830	2026-05-26 22:26:32.981963	\N	\N	\N	\N	Matah Yondjio	\N	https://media.api-sports.io/football/players/630702.png
42207	\N	2026-05-26 22:26:32.986961	831	2026-05-26 22:26:32.986961	\N	\N	\N	\N	Mahmud Abunada	\N	https://media.api-sports.io/football/players/42207.png
42021	\N	2026-05-26 22:26:32.991974	832	2026-05-26 22:26:32.991973	\N	\N	\N	\N	Meshaal Barsham	\N	https://media.api-sports.io/football/players/42021.png
42055	\N	2026-05-26 22:26:32.996703	833	2026-05-26 22:26:32.996703	\N	\N	\N	\N	Shehab Ellethy	\N	https://media.api-sports.io/football/players/42055.png
175439	\N	2026-05-26 22:26:33.002049	834	2026-05-26 22:26:33.002049	\N	\N	\N	\N	Homam Ahmed	\N	https://media.api-sports.io/football/players/175439.png
42060	\N	2026-05-26 22:26:33.008419	835	2026-05-26 22:26:33.008419	\N	\N	\N	\N	Sultan Al Braik	\N	https://media.api-sports.io/football/players/42060.png
542542	\N	2026-05-26 22:26:33.01558	836	2026-05-26 22:26:33.015579	\N	\N	\N	\N	A. Al Hussain	\N	https://media.api-sports.io/football/players/542542.png
542548	\N	2026-05-26 22:26:33.021891	837	2026-05-26 22:26:33.021891	\N	\N	\N	\N	A. Al Oui	\N	https://media.api-sports.io/football/players/542548.png
42421	\N	2026-05-26 22:26:33.026637	838	2026-05-26 22:26:33.026637	\N	\N	\N	\N	Youssef Ayman	\N	https://media.api-sports.io/football/players/42421.png
200981	\N	2026-05-26 22:26:33.031554	839	2026-05-26 22:26:33.031554	\N	\N	\N	\N	Jassem Gaber	\N	https://media.api-sports.io/football/players/200981.png
42288	\N	2026-05-26 22:26:33.036825	840	2026-05-26 22:26:33.036825	\N	\N	\N	\N	Lucas Mendes	\N	https://media.api-sports.io/football/players/42288.png
2535	\N	2026-05-26 22:26:33.042112	841	2026-05-26 22:26:33.042112	\N	\N	\N	\N	Assim Madibo	\N	https://media.api-sports.io/football/players/2535.png
283174	\N	2026-05-26 22:26:33.047862	842	2026-05-26 22:26:33.047862	\N	\N	\N	\N	Mohamed Al Manai	\N	https://media.api-sports.io/football/players/283174.png
534032	\N	2026-05-26 22:26:33.051864	843	2026-05-26 22:26:33.051863	\N	\N	\N	\N	Ali	\N	https://media.api-sports.io/football/players/534032.png
2539	\N	2026-05-26 22:26:33.056863	844	2026-05-26 22:26:33.056863	\N	\N	\N	\N	Ahmed Fathi	\N	https://media.api-sports.io/football/players/2539.png
2533	\N	2026-05-26 22:26:33.062863	845	2026-05-26 22:26:33.062862	\N	\N	\N	\N	Abdulaziz Hatem	\N	https://media.api-sports.io/football/players/2533.png
542536	\N	2026-05-26 22:26:33.068863	846	2026-05-26 22:26:33.068862	\N	\N	\N	\N	G. Laye	\N	https://media.api-sports.io/football/players/542536.png
2541	\N	2026-05-26 22:26:33.073863	847	2026-05-26 22:26:33.073862	\N	\N	\N	\N	Tarek Salman	\N	https://media.api-sports.io/football/players/2541.png
42180	\N	2026-05-26 22:26:33.078863	848	2026-05-26 22:26:33.078862	\N	\N	\N	\N	Mohammed Waad	\N	https://media.api-sports.io/football/players/42180.png
2544	\N	2026-05-26 22:26:33.083863	849	2026-05-26 22:26:33.083862	\N	\N	\N	\N	Akram Afif	\N	https://media.api-sports.io/football/players/2544.png
2542	\N	2026-05-26 22:26:33.089864	850	2026-05-26 22:26:33.089863	\N	\N	\N	\N	Ahmed Alaa	\N	https://media.api-sports.io/football/players/2542.png
42075	\N	2026-05-26 22:26:33.096865	851	2026-05-26 22:26:33.096865	\N	\N	\N	\N	Edmilson Junior	\N	https://media.api-sports.io/football/players/42075.png
542531	\N	2026-05-26 22:26:33.107665	852	2026-05-26 22:26:33.107664	\N	\N	\N	\N	M. Gouda	\N	https://media.api-sports.io/football/players/542531.png
42089	\N	2026-05-26 22:26:33.112956	853	2026-05-26 22:26:33.112956	\N	\N	\N	\N	Mohammed Muntari	\N	https://media.api-sports.io/football/players/42089.png
16579	\N	2026-05-26 22:26:33.118234	854	2026-05-26 22:26:33.118233	\N	\N	\N	\N	D. Cabezas	\N	https://media.api-sports.io/football/players/16579.png
16380	\N	2026-05-26 22:26:33.123007	855	2026-05-26 22:26:33.123006	\N	\N	\N	\N	H. Galíndez	\N	https://media.api-sports.io/football/players/16380.png
410134	\N	2026-05-26 22:26:33.127875	856	2026-05-26 22:26:33.127875	\N	\N	\N	\N	C. Loor	\N	https://media.api-sports.io/football/players/410134.png
81224	\N	2026-05-26 22:26:33.133133	857	2026-05-26 22:26:33.133132	\N	\N	\N	\N	M. Ramírez	\N	https://media.api-sports.io/football/players/81224.png
16642	\N	2026-05-26 22:26:33.13875	858	2026-05-26 22:26:33.138749	\N	\N	\N	\N	G. Valle	\N	https://media.api-sports.io/football/players/16642.png
46731	\N	2026-05-26 22:26:33.144749	859	2026-05-26 22:26:33.144748	\N	\N	\N	\N	P. Estupiñán	\N	https://media.api-sports.io/football/players/46731.png
127817	\N	2026-05-26 22:26:33.148753	860	2026-05-26 22:26:33.148753	\N	\N	\N	\N	P. Hincapié	\N	https://media.api-sports.io/football/players/127817.png
68113	\N	2026-05-26 22:26:33.15475	861	2026-05-26 22:26:33.15475	\N	\N	\N	\N	J. Hurtado	\N	https://media.api-sports.io/football/players/68113.png
306940	\N	2026-05-26 22:26:33.160749	862	2026-05-26 22:26:33.160749	\N	\N	\N	\N	Y. Medina	\N	https://media.api-sports.io/football/players/306940.png
354027	\N	2026-05-26 22:26:33.165749	863	2026-05-26 22:26:33.165749	\N	\N	\N	\N	J. Ordoñez	\N	https://media.api-sports.io/football/players/354027.png
16367	\N	2026-05-26 22:26:33.170748	864	2026-05-26 22:26:33.170748	\N	\N	\N	\N	W. Pacho	\N	https://media.api-sports.io/football/players/16367.png
2575	\N	2026-05-26 22:26:33.175752	865	2026-05-26 22:26:33.175752	\N	\N	\N	\N	J. Porozo	\N	https://media.api-sports.io/football/players/2575.png
2583	\N	2026-05-26 22:26:33.180749	866	2026-05-26 22:26:33.180748	\N	\N	\N	\N	A. Preciado	\N	https://media.api-sports.io/football/players/2583.png
2076	\N	2026-05-26 22:26:33.184749	867	2026-05-26 22:26:33.184749	\N	\N	\N	\N	C. Ramírez	\N	https://media.api-sports.io/football/players/2076.png
63964	\N	2026-05-26 22:26:33.190748	868	2026-05-26 22:26:33.190748	\N	\N	\N	\N	F. Torres	\N	https://media.api-sports.io/football/players/63964.png
16470	\N	2026-05-26 22:26:33.197751	869	2026-05-26 22:26:33.19775	\N	\N	\N	\N	J. Alcívar	\N	https://media.api-sports.io/football/players/16470.png
116117	\N	2026-05-26 22:26:33.202751	870	2026-05-26 22:26:33.202751	\N	\N	\N	\N	M. Caicedo	\N	https://media.api-sports.io/football/players/116117.png
338045	\N	2026-05-26 22:26:33.209751	871	2026-05-26 22:26:33.20975	\N	\N	\N	\N	D. Castillo	\N	https://media.api-sports.io/football/players/338045.png
16360	\N	2026-05-26 22:26:33.214749	872	2026-05-26 22:26:33.214748	\N	\N	\N	\N	A. Franco	\N	https://media.api-sports.io/football/players/16360.png
321658	\N	2026-05-26 22:26:33.218749	873	2026-05-26 22:26:33.218748	\N	\N	\N	\N	P. Mercado	\N	https://media.api-sports.io/football/players/321658.png
406303	\N	2026-05-26 22:26:33.223749	874	2026-05-26 22:26:33.223748	\N	\N	\N	\N	K. Páez	\N	https://media.api-sports.io/football/players/406303.png
361966	\N	2026-05-26 22:26:33.227752	875	2026-05-26 22:26:33.227751	\N	\N	\N	\N	K. Rodríguez	\N	https://media.api-sports.io/football/players/361966.png
198347	\N	2026-05-26 22:26:33.23275	876	2026-05-26 22:26:33.232749	\N	\N	\N	\N	A. Valencia	\N	https://media.api-sports.io/football/players/198347.png
237078	\N	2026-05-26 22:26:33.23775	877	2026-05-26 22:26:33.237749	\N	\N	\N	\N	P. Vite	\N	https://media.api-sports.io/football/players/237078.png
25414	\N	2026-05-26 22:26:33.242749	878	2026-05-26 22:26:33.242749	\N	\N	\N	\N	J. Yeboah	\N	https://media.api-sports.io/football/players/25414.png
311543	\N	2026-05-26 22:26:33.246748	879	2026-05-26 22:26:33.246748	\N	\N	\N	\N	N. Angulo	\N	https://media.api-sports.io/football/players/311543.png
16590	\N	2026-05-26 22:26:33.250749	880	2026-05-26 22:26:33.250749	\N	\N	\N	\N	J. Caicedo	\N	https://media.api-sports.io/football/players/16590.png
16413	\N	2026-05-26 22:26:33.255041	881	2026-05-26 22:26:33.25504	\N	\N	\N	\N	J. Corozo	\N	https://media.api-sports.io/football/players/16413.png
350799	\N	2026-05-26 22:26:33.259256	882	2026-05-26 22:26:33.259256	\N	\N	\N	\N	Jeremy Arévalo	\N	https://media.api-sports.io/football/players/350799.png
625629	\N	2026-05-26 22:26:33.263606	883	2026-05-26 22:26:33.263606	\N	\N	\N	\N	Elias Legendre Quiñonez	\N	https://media.api-sports.io/football/players/625629.png
237122	\N	2026-05-26 22:26:33.268348	884	2026-05-26 22:26:33.268347	\N	\N	\N	\N	J. Mercado	\N	https://media.api-sports.io/football/players/237122.png
280695	\N	2026-05-26 22:26:33.272024	885	2026-05-26 22:26:33.272024	\N	\N	\N	\N	A. Minda	\N	https://media.api-sports.io/football/players/280695.png
16369	\N	2026-05-26 22:26:33.276087	886	2026-05-26 22:26:33.276086	\N	\N	\N	\N	G. Plata	\N	https://media.api-sports.io/football/players/16369.png
356456	\N	2026-05-26 22:26:33.280905	887	2026-05-26 22:26:33.280905	\N	\N	\N	\N	Bryan Josías Ramírez León	\N	https://media.api-sports.io/football/players/356456.png
35533	\N	2026-05-26 22:26:33.285138	888	2026-05-26 22:26:33.285138	\N	\N	\N	\N	E. Valencia	\N	https://media.api-sports.io/football/players/35533.png
266606	\N	2026-05-26 22:26:45.894604	889	2026-05-26 22:26:45.894603	\N	\N	\N	\N	C. Brady	\N	https://media.api-sports.io/football/players/266606.png
351571	\N	2026-05-26 22:26:45.899335	890	2026-05-26 22:26:45.899335	\N	\N	\N	\N	R. Celentano	\N	https://media.api-sports.io/football/players/351571.png
50728	\N	2026-05-26 22:26:45.903006	891	2026-05-26 22:26:45.903006	\N	\N	\N	\N	M. Freese	\N	https://media.api-sports.io/football/players/50728.png
25335	\N	2026-05-26 22:26:45.906683	892	2026-05-26 22:26:45.906682	\N	\N	\N	\N	J. Klinsmann	\N	https://media.api-sports.io/football/players/25335.png
102685	\N	2026-05-26 22:26:45.911449	893	2026-05-26 22:26:45.911449	\N	\N	\N	\N	P. Schulte	\N	https://media.api-sports.io/football/players/102685.png
50999	\N	2026-05-26 22:26:45.91566	894	2026-05-26 22:26:45.915659	\N	\N	\N	\N	M. Turner	\N	https://media.api-sports.io/football/players/50999.png
38735	\N	2026-05-26 22:26:45.91985	895	2026-05-26 22:26:45.91985	\N	\N	\N	\N	S. Dest	\N	https://media.api-sports.io/football/players/38735.png
355994	\N	2026-05-26 22:26:45.923537	896	2026-05-26 22:26:45.923537	\N	\N	\N	\N	A. Freeman	\N	https://media.api-sports.io/football/players/355994.png
50735	\N	2026-05-26 22:26:45.928518	897	2026-05-26 22:26:45.928518	\N	\N	\N	\N	M. McKenzie	\N	https://media.api-sports.io/football/players/50735.png
19023	\N	2026-05-26 22:26:45.932692	898	2026-05-26 22:26:45.932691	\N	\N	\N	\N	T. Ream	\N	https://media.api-sports.io/football/players/19023.png
126949	\N	2026-05-26 22:26:45.936366	899	2026-05-26 22:26:45.936366	\N	\N	\N	\N	C. Richards	\N	https://media.api-sports.io/football/players/126949.png
19549	\N	2026-05-26 22:26:45.941141	900	2026-05-26 22:26:45.94114	\N	\N	\N	\N	A. Robinson	\N	https://media.api-sports.io/football/players/19549.png
50879	\N	2026-05-26 22:26:45.94529	901	2026-05-26 22:26:45.945289	\N	\N	\N	\N	M. Robinson	\N	https://media.api-sports.io/football/players/50879.png
50852	\N	2026-05-26 22:26:45.948964	902	2026-05-26 22:26:45.948963	\N	\N	\N	\N	J. Scally	\N	https://media.api-sports.io/football/players/50852.png
119002	\N	2026-05-26 22:26:45.95316	903	2026-05-26 22:26:45.953159	\N	\N	\N	\N	J. Tolkin	\N	https://media.api-sports.io/football/players/119002.png
50737	\N	2026-05-26 22:26:45.957444	904	2026-05-26 22:26:45.957444	\N	\N	\N	\N	A. Trusty	\N	https://media.api-sports.io/football/players/50737.png
50739	\N	2026-05-26 22:26:45.962132	905	2026-05-26 22:26:45.962131	\N	\N	\N	\N	B. Aaronson	\N	https://media.api-sports.io/football/players/50739.png
201713	\N	2026-05-26 22:26:45.966307	906	2026-05-26 22:26:45.966328	\N	\N	\N	\N	S. Berhalter	\N	https://media.api-sports.io/football/players/201713.png
133185	\N	2026-05-26 22:26:45.969988	907	2026-05-26 22:26:45.969988	\N	\N	\N	\N	J. Cardoso	\N	https://media.api-sports.io/football/players/133185.png
312896	\N	2026-05-26 22:26:45.975346	908	2026-05-26 22:26:45.975346	\N	\N	\N	\N	D. Luna	\N	https://media.api-sports.io/football/players/312896.png
415	\N	2026-05-26 22:26:45.979541	909	2026-05-26 22:26:45.97954	\N	\N	\N	\N	W. McKennie	\N	https://media.api-sports.io/football/players/415.png
201714	\N	2026-05-26 22:26:45.983098	910	2026-05-26 22:26:45.983098	\N	\N	\N	\N	A. Morris	\N	https://media.api-sports.io/football/players/201714.png
161921	\N	2026-05-26 22:26:45.989099	911	2026-05-26 22:26:45.989099	\N	\N	\N	\N	G. Reyna	\N	https://media.api-sports.io/football/players/161921.png
51114	\N	2026-05-26 22:26:45.994873	912	2026-05-26 22:26:45.994873	\N	\N	\N	\N	C. Roldan	\N	https://media.api-sports.io/football/players/51114.png
80752	\N	2026-05-26 22:26:45.999602	913	2026-05-26 22:26:45.999601	\N	\N	\N	\N	T. Tessmann	\N	https://media.api-sports.io/football/players/80752.png
162037	\N	2026-05-26 22:26:46.003892	914	2026-05-26 22:26:46.003891	\N	\N	\N	\N	M. Tillman	\N	https://media.api-sports.io/football/players/162037.png
25617	\N	2026-05-26 22:26:46.008205	915	2026-05-26 22:26:46.008205	\N	\N	\N	\N	T. Tillman	\N	https://media.api-sports.io/football/players/25617.png
1138	\N	2026-05-26 22:26:46.012398	916	2026-05-26 22:26:46.012397	\N	\N	\N	\N	T. Weah	\N	https://media.api-sports.io/football/players/1138.png
407652	\N	2026-05-26 22:26:46.016657	917	2026-05-26 22:26:46.016656	\N	\N	\N	\N	P. Agyemang	\N	https://media.api-sports.io/football/players/407652.png
362400	\N	2026-05-26 22:26:46.02139	918	2026-05-26 22:26:46.021389	\N	\N	\N	\N	M. Arfsten	\N	https://media.api-sports.io/football/players/362400.png
138835	\N	2026-05-26 22:26:46.025069	919	2026-05-26 22:26:46.025068	\N	\N	\N	\N	F. Balogun	\N	https://media.api-sports.io/football/players/138835.png
73868	\N	2026-05-26 22:26:46.029251	920	2026-05-26 22:26:46.02925	\N	\N	\N	\N	R. Pepi	\N	https://media.api-sports.io/football/players/73868.png
17	\N	2026-05-26 22:26:46.033001	921	2026-05-26 22:26:46.033	\N	\N	\N	\N	C. Pulišić	\N	https://media.api-sports.io/football/players/17.png
427	\N	2026-05-26 22:26:46.03773	922	2026-05-26 22:26:46.03773	\N	\N	\N	\N	H. Wright	\N	https://media.api-sports.io/football/players/427.png
51274	\N	2026-05-26 22:26:46.04193	923	2026-05-26 22:26:46.04193	\N	\N	\N	\N	M. Crépeau	\N	https://media.api-sports.io/football/players/51274.png
351582	\N	2026-05-26 22:26:46.046129	924	2026-05-26 22:26:46.046128	\N	\N	\N	\N	L. Gavran	\N	https://media.api-sports.io/football/players/351582.png
284554	\N	2026-05-26 22:26:46.050959	925	2026-05-26 22:26:46.050959	\N	\N	\N	\N	O. Goodman	\N	https://media.api-sports.io/football/players/284554.png
50778	\N	2026-05-26 22:26:46.055672	926	2026-05-26 22:26:46.055672	\N	\N	\N	\N	J. Pantemis	\N	https://media.api-sports.io/football/players/50778.png
51148	\N	2026-05-26 22:26:46.060387	927	2026-05-26 22:26:46.060387	\N	\N	\N	\N	D. St. Clair	\N	https://media.api-sports.io/football/players/51148.png
370936	\N	2026-05-26 22:26:46.064721	928	2026-05-26 22:26:46.064721	\N	\N	\N	\N	N. Abatneh	\N	https://media.api-sports.io/football/players/370936.png
8660	\N	2026-05-26 22:26:46.068908	929	2026-05-26 22:26:46.068908	\N	\N	\N	\N	Z. Bassong	\N	https://media.api-sports.io/football/players/8660.png
51295	\N	2026-05-26 22:26:46.073099	930	2026-05-26 22:26:46.073098	\N	\N	\N	\N	D. Cornelius	\N	https://media.api-sports.io/football/players/51295.png
327738	\N	2026-05-26 22:26:46.082133	931	2026-05-26 22:26:46.082133	\N	\N	\N	\N	L. De Fougerolles	\N	https://media.api-sports.io/football/players/327738.png
50816	\N	2026-05-26 22:26:46.089481	932	2026-05-26 22:26:46.08948	\N	\N	\N	\N	R. Laryea	\N	https://media.api-sports.io/football/players/50816.png
201707	\N	2026-05-26 22:26:46.095197	933	2026-05-26 22:26:46.095197	\N	\N	\N	\N	J. Marshall-Rutty	\N	https://media.api-sports.io/football/players/201707.png
50925	\N	2026-05-26 22:26:46.100517	934	2026-05-26 22:26:46.100517	\N	\N	\N	\N	K. Miller	\N	https://media.api-sports.io/football/players/50925.png
78494	\N	2026-05-26 22:26:46.111658	935	2026-05-26 22:26:46.111657	\N	\N	\N	\N	J. Waterman	\N	https://media.api-sports.io/football/players/78494.png
362145	\N	2026-05-26 22:26:46.116367	936	2026-05-26 22:26:46.116366	\N	\N	\N	\N	A. Ahmed	\N	https://media.api-sports.io/football/players/362145.png
51016	\N	2026-05-26 22:26:46.120549	937	2026-05-26 22:26:46.120549	\N	\N	\N	\N	T. Buchanan	\N	https://media.api-sports.io/football/players/51016.png
50788	\N	2026-05-26 22:26:46.124482	938	2026-05-26 22:26:46.124482	\N	\N	\N	\N	M. Choinière	\N	https://media.api-sports.io/football/players/50788.png
35570	\N	2026-05-26 22:26:46.12921	939	2026-05-26 22:26:46.129209	\N	\N	\N	\N	S. Eustáquio	\N	https://media.api-sports.io/football/players/35570.png
284061	\N	2026-05-26 22:26:46.133419	940	2026-05-26 22:26:46.133419	\N	\N	\N	\N	M. Flores	\N	https://media.api-sports.io/football/players/284061.png
512956	\N	2026-05-26 22:26:46.137569	941	2026-05-26 22:26:46.137569	\N	\N	\N	\N	Malik Henry	\N	https://media.api-sports.io/football/players/512956.png
328046	\N	2026-05-26 22:26:46.141599	942	2026-05-26 22:26:46.141599	\N	\N	\N	\N	I. Koné	\N	https://media.api-sports.io/football/players/328046.png
50817	\N	2026-05-26 22:26:46.145602	943	2026-05-26 22:26:46.145601	\N	\N	\N	\N	J. Osorio	\N	https://media.api-sports.io/football/players/50817.png
203436	\N	2026-05-26 22:26:46.149599	944	2026-05-26 22:26:46.149599	\N	\N	\N	\N	R. Priso	\N	https://media.api-sports.io/football/players/203436.png
294824	\N	2026-05-26 22:26:46.154598	945	2026-05-26 22:26:46.154598	\N	\N	\N	\N	N. Saliba	\N	https://media.api-sports.io/football/players/294824.png
416901	\N	2026-05-26 22:26:46.160599	946	2026-05-26 22:26:46.160599	\N	\N	\N	\N	N. Sigur	\N	https://media.api-sports.io/football/players/416901.png
269936	\N	2026-05-26 22:26:46.1656	947	2026-05-26 22:26:46.1656	\N	\N	\N	\N	M. de Brienne	\N	https://media.api-sports.io/football/players/269936.png
541949	\N	2026-05-26 22:26:46.170599	948	2026-05-26 22:26:46.170599	\N	\N	\N	\N	M. Aiyenero	\N	https://media.api-sports.io/football/players/541949.png
51293	\N	2026-05-26 22:26:46.175599	949	2026-05-26 22:26:46.175598	\N	\N	\N	\N	T. Bair	\N	https://media.api-sports.io/football/players/51293.png
370938	\N	2026-05-26 22:26:46.179602	950	2026-05-26 22:26:46.179601	\N	\N	\N	\N	T. Coimbra	\N	https://media.api-sports.io/football/players/370938.png
8489	\N	2026-05-26 22:26:46.184599	951	2026-05-26 22:26:46.184599	\N	\N	\N	\N	J. David	\N	https://media.api-sports.io/football/players/8489.png
313353	\N	2026-05-26 22:26:46.190601	952	2026-05-26 22:26:46.1916	\N	\N	\N	\N	P. David	\N	https://media.api-sports.io/football/players/313353.png
19007	\N	2026-05-26 22:26:46.197601	953	2026-05-26 22:26:46.1976	\N	\N	\N	\N	J. Hoilett	\N	https://media.api-sports.io/football/players/19007.png
296458	\N	2026-05-26 22:26:46.203599	954	2026-05-26 22:26:46.203599	\N	\N	\N	\N	D. Jebbison	\N	https://media.api-sports.io/football/players/296458.png
2001	\N	2026-05-26 22:26:46.209599	955	2026-05-26 22:26:46.209598	\N	\N	\N	\N	C. Larin	\N	https://media.api-sports.io/football/players/2001.png
44798	\N	2026-05-26 22:26:46.213599	956	2026-05-26 22:26:46.213599	\N	\N	\N	\N	L. Millar	\N	https://media.api-sports.io/football/players/44798.png
193279	\N	2026-05-26 22:26:46.2206	957	2026-05-26 22:26:46.2206	\N	\N	\N	\N	J. Nelson	\N	https://media.api-sports.io/football/players/193279.png
351587	\N	2026-05-26 22:26:46.2266	958	2026-05-26 22:26:46.226599	\N	\N	\N	\N	T. Oluwaseyi	\N	https://media.api-sports.io/football/players/351587.png
146325	\N	2026-05-26 22:26:46.2316	959	2026-05-26 22:26:46.231599	\N	\N	\N	\N	A. Pepple	\N	https://media.api-sports.io/football/players/146325.png
203428	\N	2026-05-26 22:26:46.2386	960	2026-05-26 22:26:46.238599	\N	\N	\N	\N	J. Russell-Rowe	\N	https://media.api-sports.io/football/players/203428.png
50826	\N	2026-05-26 22:26:46.2446	961	2026-05-26 22:26:46.2446	\N	\N	\N	\N	J. Shaffelburg	\N	https://media.api-sports.io/football/players/50826.png
\.


--
-- Data for Name: squad_entries; Type: TABLE DATA; Schema: public; Owner: pitchlog
--

COPY public.squad_entries (is_active, jersey_number, country_id, id, player_id, updated_at, "position") FROM stdin;
t	1	1	1	1	2026-05-26 22:23:50.748053	GK
t	1	1	2	2	2026-05-26 22:23:50.756716	GK
t	1	1	3	3	2026-05-26 22:23:50.763524	GK
t	21	1	4	4	2026-05-26 22:23:50.76921	DEF
t	5	1	5	5	2026-05-26 22:23:50.775312	DEF
t	16	1	6	6	2026-05-26 22:23:50.780312	DEF
t	2	1	7	7	2026-05-26 22:23:50.787746	DEF
t	4	1	8	8	2026-05-26 22:23:50.794081	DEF
t	15	1	9	9	2026-05-26 22:23:50.801853	DEF
t	17	1	10	10	2026-05-26 22:23:50.810799	DEF
t	2	1	11	11	2026-05-26 22:23:50.821104	DEF
t	3	1	12	12	2026-05-26 22:23:50.835372	DEF
t	7	1	13	13	2026-05-26 22:23:50.844553	MID
t	17	1	14	14	2026-05-26 22:23:50.852664	MID
t	7	1	15	15	2026-05-26 22:23:50.859496	MID
t	18	1	16	16	2026-05-26 22:23:50.866981	MID
t	23	1	17	17	2026-05-26 22:23:50.873841	MID
t	22	1	18	18	2026-05-26 22:23:50.881323	MID
t	8	1	19	19	2026-05-26 22:23:50.88791	MID
t	6	1	20	20	2026-05-26 22:23:50.894543	MID
t	11	1	21	21	2026-05-26 22:23:50.900858	FWD
t	7	1	22	22	2026-05-26 22:23:50.906266	FWD
t	10	1	23	23	2026-05-26 22:23:50.91225	FWD
t	14	1	24	24	2026-05-26 22:23:50.917531	FWD
t	16	2	25	25	2026-05-26 22:23:50.922984	GK
t	16	2	26	26	2026-05-26 22:23:50.929297	GK
t	1	2	27	27	2026-05-26 22:23:50.935136	GK
t	3	2	28	28	2026-05-26 22:23:50.940523	DEF
t	2	2	29	29	2026-05-26 22:23:50.946296	DEF
t	21	2	30	30	2026-05-26 22:23:50.952083	DEF
t	22	2	31	31	2026-05-26 22:23:50.958012	DEF
t	15	2	32	32	2026-05-26 22:23:50.965093	DEF
t	19	2	33	33	2026-05-26 22:23:50.970942	DEF
t	4	2	34	34	2026-05-26 22:23:50.976721	DEF
t	14	2	35	35	2026-05-26 22:23:50.981971	MID
t	13	2	36	36	2026-05-26 22:23:50.988398	MID
t	8	2	37	37	2026-05-26 22:23:50.994804	MID
t	11	2	38	38	2026-05-26 22:23:51.004176	MID
t	14	2	39	39	2026-05-26 22:23:51.014513	MID
t	8	2	40	40	2026-05-26 22:23:51.024921	MID
t	18	2	41	41	2026-05-26 22:23:51.035758	MID
t	12	2	42	42	2026-05-26 22:23:51.044704	FWD
t	7	2	43	43	2026-05-26 22:23:51.055209	FWD
t	12	2	44	44	2026-05-26 22:23:51.065975	FWD
t	10	2	45	45	2026-05-26 22:23:51.083449	FWD
t	9	2	46	46	2026-05-26 22:23:51.098492	FWD
t	12	3	47	47	2026-05-26 22:23:51.106491	GK
t	1	3	48	48	2026-05-26 22:23:51.116489	GK
t	12	3	49	49	2026-05-26 22:23:51.123489	GK
t	5	3	50	50	2026-05-26 22:23:51.130489	DEF
t	22	3	51	51	2026-05-26 22:23:51.135491	DEF
t	4	3	52	52	2026-05-26 22:23:51.140489	DEF
t	3	3	53	53	2026-05-26 22:23:51.15249	DEF
t	2	3	54	54	2026-05-26 22:23:51.159488	DEF
t	6	3	55	55	2026-05-26 22:23:51.16549	DEF
t	4	3	56	56	2026-05-26 22:23:51.170489	DEF
t	16	3	57	57	2026-05-26 22:23:51.177489	MID
t	19	3	58	58	2026-05-26 22:23:51.18249	MID
t	18	3	59	59	2026-05-26 22:23:51.188489	MID
t	8	3	60	60	2026-05-26 22:23:51.193491	MID
t	10	3	61	61	2026-05-26 22:23:51.198488	MID
t	8	3	62	62	2026-05-26 22:23:51.20449	MID
t	15	3	63	63	2026-05-26 22:23:51.210491	MID
t	21	3	64	64	2026-05-26 22:23:51.216489	MID
t	17	3	65	65	2026-05-26 22:23:51.222489	MID
t	13	3	66	66	2026-05-26 22:23:51.228488	MID
t	11	3	67	67	2026-05-26 22:23:51.23649	FWD
t	9	3	68	68	2026-05-26 22:23:51.24649	FWD
t	21	3	69	69	2026-05-26 22:23:51.255489	FWD
t	11	3	70	70	2026-05-26 22:23:51.26449	FWD
t	7	3	71	71	2026-05-26 22:23:51.27449	FWD
t	14	3	72	72	2026-05-26 22:23:51.286489	FWD
t	1	4	73	73	2026-05-26 22:23:51.298489	GK
t	23	4	74	74	2026-05-26 22:23:51.30849	GK
t	1	4	75	75	2026-05-26 22:23:51.318489	GK
t	25	4	76	76	2026-05-26 22:23:51.328704	DEF
t	2	4	77	77	2026-05-26 22:23:51.33714	DEF
t	3	4	78	78	2026-05-26 22:23:51.344658	DEF
t	15	4	79	79	2026-05-26 22:23:51.352539	DEF
t	15	4	80	80	2026-05-26 22:23:51.360656	DEF
t	4	4	81	81	2026-05-26 22:23:51.368895	DEF
t	6	4	82	82	2026-05-26 22:23:51.377026	DEF
t	2	4	83	83	2026-05-26 22:23:51.383344	DEF
t	5	4	84	84	2026-05-26 22:23:51.390287	MID
t	\N	4	85	85	2026-05-26 22:23:51.397134	MID
t	15	4	86	86	2026-05-26 22:23:51.402727	MID
t	21	4	87	87	2026-05-26 22:23:51.409027	FWD
t	19	4	88	88	2026-05-26 22:23:51.415879	FWD
t	19	4	89	89	2026-05-26 22:23:51.423097	FWD
t	22	4	90	90	2026-05-26 22:23:51.42889	FWD
t	10	4	91	91	2026-05-26 22:23:51.435379	FWD
t	10	4	92	92	2026-05-26 22:23:51.44063	FWD
t	7	4	93	93	2026-05-26 22:23:51.446153	FWD
t	\N	4	94	94	2026-05-26 22:23:51.45207	FWD
t	10	4	95	95	2026-05-26 22:23:51.457879	FWD
t	1	5	96	96	2026-05-26 22:23:51.463857	GK
t	23	5	97	97	2026-05-26 22:23:51.469106	GK
t	1	5	98	98	2026-05-26 22:23:51.473838	GK
t	1	5	99	99	2026-05-26 22:23:51.478663	GK
t	4	5	100	100	2026-05-26 22:23:51.484071	DEF
t	2	5	101	101	2026-05-26 22:23:51.489868	DEF
t	3	5	102	102	2026-05-26 22:23:51.49748	DEF
t	2	5	103	103	2026-05-26 22:23:51.503478	DEF
t	16	5	104	104	2026-05-26 22:23:51.508479	DEF
t	22	5	105	105	2026-05-26 22:23:51.514478	DEF
t	14	5	106	106	2026-05-26 22:23:51.520478	DEF
t	13	5	107	107	2026-05-26 22:23:51.528479	DEF
t	17	5	108	108	2026-05-26 22:23:51.535478	DEF
t	15	5	109	109	2026-05-26 22:23:51.540477	MID
t	20	5	110	110	2026-05-26 22:23:51.547479	MID
t	18	5	111	111	2026-05-26 22:23:51.554478	MID
t	5	5	112	112	2026-05-26 22:23:51.56148	MID
t	15	5	113	113	2026-05-26 22:23:51.568477	MID
t	10	5	114	114	2026-05-26 22:23:51.575479	MID
t	7	5	115	115	2026-05-26 22:23:51.581478	MID
t	7	5	116	116	2026-05-26 22:23:51.586478	FWD
t	9	5	117	117	2026-05-26 22:23:51.593477	FWD
t	20	5	118	118	2026-05-26 22:23:51.59848	FWD
t	14	5	119	119	2026-05-26 22:23:51.605479	FWD
t	9	5	120	120	2026-05-26 22:23:51.611481	FWD
t	11	5	121	121	2026-05-26 22:23:51.617479	FWD
t	10	5	122	122	2026-05-26 22:23:51.623478	FWD
t	21	5	123	123	2026-05-26 22:23:51.628482	FWD
t	13	5	124	124	2026-05-26 22:23:51.633477	FWD
t	13	6	125	125	2026-05-26 22:24:23.178812	GK
t	1	6	126	126	2026-05-26 22:24:23.184058	GK
t	13	6	127	127	2026-05-26 22:24:23.188429	GK
t	23	6	128	128	2026-05-26 22:24:23.193684	GK
t	15	6	129	129	2026-05-26 22:24:23.198383	DEF
t	22	6	130	130	2026-05-26 22:24:23.204817	DEF
t	3	6	131	131	2026-05-26 22:24:23.210034	DEF
t	5	6	132	132	2026-05-26 22:24:23.214786	DEF
t	14	6	133	133	2026-05-26 22:24:23.221234	DEF
t	5	6	134	134	2026-05-26 22:24:23.226477	DEF
t	3	6	135	135	2026-05-26 22:24:23.232316	DEF
t	12	6	136	136	2026-05-26 22:24:23.238363	DEF
t	2	6	137	137	2026-05-26 22:24:23.245753	MID
t	19	6	138	138	2026-05-26 22:24:23.251767	MID
t	17	6	139	139	2026-05-26 22:24:23.257436	MID
t	10	6	140	140	2026-05-26 22:24:23.262651	MID
t	20	6	141	141	2026-05-26 22:24:23.268074	MID
t	16	6	142	142	2026-05-26 22:24:23.272804	MID
t	19	6	143	143	2026-05-26 22:24:23.278455	MID
t	18	6	144	144	2026-05-26 22:24:23.284266	MID
t	16	6	145	145	2026-05-26 22:24:23.290594	FWD
t	11	6	146	146	2026-05-26 22:24:23.297658	FWD
t	9	6	147	147	2026-05-26 22:24:23.303251	FWD
t	19	6	148	148	2026-05-26 22:24:23.309099	FWD
t	\N	6	149	149	2026-05-26 22:24:23.314909	FWD
t	21	6	150	150	2026-05-26 22:24:23.3202	FWD
t	11	6	151	151	2026-05-26 22:24:23.326597	FWD
t	3	6	152	152	2026-05-26 22:24:23.331115	FWD
t	7	6	153	153	2026-05-26 22:24:23.336193	FWD
t	13	7	154	154	2026-05-26 22:24:23.342663	GK
t	1	7	155	155	2026-05-26 22:24:23.350736	GK
t	1	7	156	156	2026-05-26 22:24:23.360264	GK
t	18	7	157	157	2026-05-26 22:24:23.371171	GK
t	22	7	158	158	2026-05-26 22:24:23.378675	GK
t	12	7	159	159	2026-05-26 22:24:23.386209	DEF
t	5	7	160	160	2026-05-26 22:24:23.396383	DEF
t	3	7	161	161	2026-05-26 22:24:23.407519	DEF
t	2	7	162	162	2026-05-26 22:24:23.418518	DEF
t	16	7	163	163	2026-05-26 22:24:23.428517	DEF
t	6	7	164	164	2026-05-26 22:24:23.438518	DEF
t	14	7	165	165	2026-05-26 22:24:23.448518	DEF
t	5	7	166	166	2026-05-26 22:24:23.45944	DEF
t	12	7	167	167	2026-05-26 22:24:23.468506	DEF
t	21	7	168	168	2026-05-26 22:24:23.477502	DEF
t	21	7	169	169	2026-05-26 22:24:23.487502	MID
t	10	7	170	170	2026-05-26 22:24:23.498503	MID
t	17	7	171	171	2026-05-26 22:24:23.511501	MID
t	14	7	172	172	2026-05-26 22:24:23.523502	MID
t	8	7	173	173	2026-05-26 22:24:23.531502	MID
t	18	7	174	174	2026-05-26 22:24:23.537502	MID
t	18	7	175	175	2026-05-26 22:24:23.544502	MID
t	20	7	176	176	2026-05-26 22:24:23.550503	MID
t	15	7	177	177	2026-05-26 22:24:23.556504	MID
t	16	7	178	178	2026-05-26 22:24:23.563502	MID
t	17	7	179	179	2026-05-26 22:24:23.567505	FWD
t	20	7	180	180	2026-05-26 22:24:23.572501	FWD
t	18	7	181	181	2026-05-26 22:24:23.578503	FWD
t	17	7	182	182	2026-05-26 22:24:23.582504	FWD
t	21	7	183	183	2026-05-26 22:24:23.589503	FWD
t	11	7	184	184	2026-05-26 22:24:23.596502	FWD
t	19	7	185	185	2026-05-26 22:24:23.603503	FWD
t	12	8	186	186	2026-05-26 22:24:23.611502	GK
t	1	8	187	187	2026-05-26 22:24:23.619502	GK
t	1	8	188	188	2026-05-26 22:24:23.628501	GK
t	21	8	189	189	2026-05-26 22:24:23.637502	DEF
t	5	8	190	190	2026-05-26 22:24:23.647503	DEF
t	22	8	191	191	2026-05-26 22:24:23.655502	DEF
t	2	8	192	192	2026-05-26 22:24:23.665502	DEF
t	4	8	193	193	2026-05-26 22:24:23.676501	DEF
t	3	8	194	194	2026-05-26 22:24:23.687171	DEF
t	22	8	195	195	2026-05-26 22:24:23.699257	DEF
t	4	8	196	196	2026-05-26 22:24:23.708531	DEF
t	10	8	197	197	2026-05-26 22:24:23.718528	MID
t	15	8	198	198	2026-05-26 22:24:23.727527	MID
t	5	8	199	199	2026-05-26 22:24:23.734527	MID
t	8	8	200	200	2026-05-26 22:24:23.741527	MID
t	\N	8	201	201	2026-05-26 22:24:23.748526	FWD
t	14	8	202	202	2026-05-26 22:24:23.755527	FWD
t	11	8	203	203	2026-05-26 22:24:23.763527	FWD
t	13	8	204	204	2026-05-26 22:24:23.770527	FWD
t	19	8	205	205	2026-05-26 22:24:23.776526	FWD
t	14	8	206	206	2026-05-26 22:24:23.782527	FWD
t	8	8	207	207	2026-05-26 22:24:23.787528	FWD
t	9	8	208	208	2026-05-26 22:24:23.794529	FWD
t	23	9	209	209	2026-05-26 22:24:23.801528	GK
t	1	9	210	210	2026-05-26 22:24:23.808527	GK
t	16	9	211	211	2026-05-26 22:24:23.820526	GK
t	25	9	212	212	2026-05-26 22:24:23.829527	DEF
t	14	9	213	213	2026-05-26 22:24:23.838527	DEF
t	3	9	214	214	2026-05-26 22:24:23.850527	DEF
t	24	9	215	215	2026-05-26 22:24:23.858526	DEF
t	\N	9	216	216	2026-05-26 22:24:23.864527	DEF
t	19	9	217	217	2026-05-26 22:24:23.869528	DEF
t	2	9	218	218	2026-05-26 22:24:23.875528	DEF
t	4	9	219	219	2026-05-26 22:24:23.881529	DEF
t	14	9	220	220	2026-05-26 22:24:23.888528	MID
t	8	9	221	221	2026-05-26 22:24:23.895526	MID
t	28	9	222	222	2026-05-26 22:24:23.900526	MID
t	6	9	223	223	2026-05-26 22:24:23.906529	MID
t	7	9	224	224	2026-05-26 22:24:23.910527	MID
t	15	9	225	225	2026-05-26 22:24:23.91553	MID
t	5	9	226	226	2026-05-26 22:24:23.921526	MID
t	26	9	227	227	2026-05-26 22:24:23.926527	MID
t	17	9	228	228	2026-05-26 22:24:23.930527	MID
t	9	9	229	229	2026-05-26 22:24:23.936526	FWD
t	20	9	230	230	2026-05-26 22:24:23.940528	FWD
t	20	9	231	231	2026-05-26 22:24:23.944527	FWD
t	7	9	232	232	2026-05-26 22:24:23.949528	FWD
t	9	9	233	233	2026-05-26 22:24:23.955528	FWD
t	11	9	234	234	2026-05-26 22:24:23.961527	FWD
t	10	9	235	235	2026-05-26 22:24:23.96553	FWD
t	27	9	236	236	2026-05-26 22:24:23.971528	FWD
t	12	9	237	237	2026-05-26 22:24:23.975529	FWD
t	13	9	238	238	2026-05-26 22:24:23.980526	FWD
t	22	9	239	239	2026-05-26 22:24:23.984529	FWD
t	21	9	240	240	2026-05-26 22:24:23.990529	FWD
t	18	9	241	241	2026-05-26 22:24:24.004527	FWD
t	1	10	242	242	2026-05-26 22:24:24.009527	GK
t	12	10	243	243	2026-05-26 22:24:24.015527	GK
t	1	10	244	244	2026-05-26 22:24:24.027528	GK
t	23	10	245	245	2026-05-26 22:24:24.034528	GK
t	21	10	246	246	2026-05-26 22:24:24.039526	GK
t	1	10	247	247	2026-05-26 22:24:24.044526	GK
t	21	10	248	248	2026-05-26 22:24:24.049528	GK
t	13	10	249	249	2026-05-26 22:24:24.053527	DEF
t	16	10	250	250	2026-05-26 22:24:24.059527	DEF
t	4	10	251	251	2026-05-26 22:24:24.066529	DEF
t	4	10	252	252	2026-05-26 22:24:24.071527	DEF
t	2	10	253	253	2026-05-26 22:24:24.075528	DEF
t	2	10	254	254	2026-05-26 22:24:24.080529	DEF
t	3	10	255	255	2026-05-26 22:24:24.084527	DEF
t	15	10	256	256	2026-05-26 22:24:24.089527	DEF
t	22	10	257	257	2026-05-26 22:24:24.095528	DEF
t	13	10	258	258	2026-05-26 22:24:24.100529	DEF
t	2	10	259	259	2026-05-26 22:24:24.105527	MID
t	21	10	260	260	2026-05-26 22:24:24.109528	MID
t	5	10	261	261	2026-05-26 22:24:24.114527	MID
t	6	10	262	262	2026-05-26 22:24:24.118527	MID
t	17	10	263	263	2026-05-26 22:24:24.124528	MID
t	18	10	264	264	2026-05-26 22:24:24.129526	MID
t	23	10	265	265	2026-05-26 22:24:24.133528	MID
t	11	10	266	266	2026-05-26 22:24:24.138527	MID
t	10	10	267	267	2026-05-26 22:24:24.142528	MID
t	10	10	268	268	2026-05-26 22:24:24.147526	MID
t	5	10	269	269	2026-05-26 22:24:24.152528	MID
t	20	10	270	270	2026-05-26 22:24:24.158528	MID
t	8	10	271	271	2026-05-26 22:24:24.163527	MID
t	20	10	272	272	2026-05-26 22:24:24.168527	MID
t	22	10	273	273	2026-05-26 22:24:24.174527	MID
t	19	10	274	274	2026-05-26 22:24:24.180528	MID
t	14	10	275	275	2026-05-26 22:24:24.186528	MID
t	17	10	276	276	2026-05-26 22:24:24.192526	MID
t	\N	10	277	277	2026-05-26 22:24:24.198527	FWD
t	9	10	278	278	2026-05-26 22:24:24.203527	FWD
t	18	10	279	279	2026-05-26 22:24:24.208526	FWD
t	19	10	280	280	2026-05-26 22:24:24.21253	FWD
t	8	10	281	281	2026-05-26 22:24:24.217526	FWD
t	9	10	282	282	2026-05-26 22:24:24.222527	FWD
t	22	10	283	283	2026-05-26 22:24:24.226528	FWD
t	7	10	284	284	2026-05-26 22:24:24.231527	FWD
t	19	10	285	285	2026-05-26 22:24:24.235527	FWD
t	9	10	286	286	2026-05-26 22:24:24.23953	FWD
t	23	10	287	287	2026-05-26 22:24:24.24353	FWD
t	21	11	288	288	2026-05-26 22:24:55.752993	GK
t	1	11	289	289	2026-05-26 22:24:55.760748	GK
t	12	11	290	290	2026-05-26 22:24:55.76663	GK
t	5	11	291	291	2026-05-26 22:24:55.771998	DEF
t	18	11	292	292	2026-05-26 22:24:55.776703	DEF
t	18	11	293	293	2026-05-26 22:24:55.781385	DEF
t	4	11	294	294	2026-05-26 22:24:55.786945	DEF
t	20	11	295	295	2026-05-26 22:24:55.791659	DEF
t	2	11	296	296	2026-05-26 22:24:55.79532	DEF
t	13	11	297	297	2026-05-26 22:24:55.800689	DEF
t	3	11	298	298	2026-05-26 22:24:55.805957	DEF
t	20	11	299	299	2026-05-26 22:24:55.809663	MID
t	8	11	300	300	2026-05-26 22:24:55.81386	MID
t	20	11	301	301	2026-05-26 22:24:55.818146	MID
t	9	11	302	302	2026-05-26 22:24:55.827719	MID
t	14	11	303	303	2026-05-26 22:24:55.83269	MID
t	10	11	304	304	2026-05-26 22:24:55.836894	MID
t	16	11	305	305	2026-05-26 22:24:55.842137	MID
t	15	11	306	306	2026-05-26 22:24:55.846993	MID
t	17	11	307	307	2026-05-26 22:24:55.851944	MID
t	10	11	308	308	2026-05-26 22:24:55.856113	MID
t	6	11	309	309	2026-05-26 22:24:55.85977	MID
t	7	11	310	310	2026-05-26 22:24:55.864053	FWD
t	11	11	311	311	2026-05-26 22:24:55.867726	FWD
t	9	11	312	312	2026-05-26 22:24:55.871378	FWD
t	22	11	313	313	2026-05-26 22:24:55.875027	FWD
t	12	12	314	314	2026-05-26 22:24:55.87881	GK
t	1	12	315	315	2026-05-26 22:24:55.883038	GK
t	13	12	316	316	2026-05-26 22:24:55.886697	GK
t	1	12	317	317	2026-05-26 22:24:55.8909	GK
t	21	12	318	318	2026-05-26 22:24:55.897354	DEF
t	3	12	319	319	2026-05-26 22:24:55.902053	DEF
t	14	12	320	320	2026-05-26 22:24:55.906767	DEF
t	\N	12	321	321	2026-05-26 22:24:55.911747	DEF
t	23	12	322	322	2026-05-26 22:24:55.916432	DEF
t	\N	12	323	323	2026-05-26 22:24:55.920087	DEF
t	22	12	324	324	2026-05-26 22:24:55.924895	DEF
t	15	12	325	325	2026-05-26 22:24:55.929113	DEF
t	3	12	326	326	2026-05-26 22:24:55.933282	DEF
t	19	12	327	327	2026-05-26 22:24:55.937442	DEF
t	15	12	328	328	2026-05-26 22:24:55.941299	DEF
t	2	12	329	329	2026-05-26 22:24:55.944976	DEF
t	5	12	330	330	2026-05-26 22:24:55.948641	DEF
t	2	12	331	331	2026-05-26 22:24:55.95297	DEF
t	25	12	332	332	2026-05-26 22:24:55.958348	FWD
t	4	12	333	333	2026-05-26 22:24:55.962634	MID
t	20	12	334	334	2026-05-26 22:24:55.966306	MID
t	6	12	335	335	2026-05-26 22:24:55.97113	MID
t	9	12	336	336	2026-05-26 22:24:55.974812	MID
t	20	12	337	337	2026-05-26 22:24:55.978485	DEF
t	\N	12	338	338	2026-05-26 22:24:55.982659	MID
t	8	12	339	339	2026-05-26 22:24:55.986433	MID
t	8	12	340	340	2026-05-26 22:24:55.9901	MID
t	26	12	341	341	2026-05-26 22:24:55.994277	MID
t	26	12	342	342	2026-05-26 22:24:55.998496	MID
t	15	12	343	343	2026-05-26 22:24:56.003289	MID
t	20	12	344	344	2026-05-26 22:24:56.007492	MID
t	6	12	345	345	2026-05-26 22:24:56.01116	MID
t	19	12	346	346	2026-05-26 22:24:56.016152	MID
t	17	12	347	347	2026-05-26 22:24:56.02015	MID
t	8	12	348	348	2026-05-26 22:24:56.024882	MID
t	7	12	349	349	2026-05-26 22:24:56.029634	DEF
t	14	12	350	350	2026-05-26 22:24:56.034631	MID
t	14	12	351	351	2026-05-26 22:24:56.039899	MID
t	18	12	352	352	2026-05-26 22:24:56.046024	MID
t	17	12	353	353	2026-05-26 22:24:56.051322	FWD
t	14	12	354	354	2026-05-26 22:24:56.056616	FWD
t	9	12	355	355	2026-05-26 22:24:56.062017	FWD
t	16	12	356	356	2026-05-26 22:24:56.066771	FWD
t	22	12	357	357	2026-05-26 22:24:56.070973	FWD
t	22	12	358	358	2026-05-26 22:24:56.075719	FWD
t	16	12	359	359	2026-05-26 22:24:56.08055	FWD
t	17	12	360	360	2026-05-26 22:24:56.086014	FWD
t	18	12	361	361	2026-05-26 22:24:56.090748	FWD
t	10	12	362	362	2026-05-26 22:24:56.096652	FWD
t	21	13	363	363	2026-05-26 22:24:56.106578	GK
t	1	13	364	364	2026-05-26 22:24:56.115325	GK
t	1	13	365	365	2026-05-26 22:24:56.121093	GK
t	14	13	366	366	2026-05-26 22:24:56.126723	DEF
t	4	13	367	367	2026-05-26 22:24:56.133057	DEF
t	15	13	368	368	2026-05-26 22:24:56.140059	DEF
t	26	13	369	369	2026-05-26 22:24:56.145329	DEF
t	13	13	370	370	2026-05-26 22:24:56.149686	DEF
t	16	13	371	371	2026-05-26 22:24:56.154668	DEF
t	3	13	372	372	2026-05-26 22:24:56.158838	DEF
t	22	13	373	373	2026-05-26 22:24:56.163044	DEF
t	17	13	374	374	2026-05-26 22:24:56.167238	MID
t	13	13	375	375	2026-05-26 22:24:56.172626	MID
t	18	13	376	376	2026-05-26 22:24:56.176797	MID
t	6	13	377	377	2026-05-26 22:24:56.181578	MID
t	6	13	378	378	2026-05-26 22:24:56.186608	MID
t	10	13	379	379	2026-05-26 22:24:56.190372	MID
t	10	13	380	380	2026-05-26 22:24:56.194575	MID
t	18	13	381	381	2026-05-26 22:24:56.199274	MID
t	5	13	382	382	2026-05-26 22:24:56.205352	MID
t	5	13	383	383	2026-05-26 22:24:56.212352	MID
t	15	13	384	384	2026-05-26 22:24:56.218353	MID
t	9	13	385	385	2026-05-26 22:24:56.231352	FWD
t	11	13	386	386	2026-05-26 22:24:56.242353	FWD
t	9	13	387	387	2026-05-26 22:24:56.251353	FWD
t	7	13	388	388	2026-05-26 22:24:56.258352	FWD
t	12	14	389	389	2026-05-26 22:24:56.265353	GK
t	12	14	390	390	2026-05-26 22:24:56.270353	GK
t	1	14	391	391	2026-05-26 22:24:56.275353	GK
t	16	14	392	392	2026-05-26 22:24:56.281353	DEF
t	5	14	393	393	2026-05-26 22:24:56.287353	DEF
t	21	14	394	394	2026-05-26 22:24:56.293353	DEF
t	23	14	395	395	2026-05-26 22:24:56.299353	DEF
t	22	14	396	396	2026-05-26 22:24:56.304353	DEF
t	13	14	397	397	2026-05-26 22:24:56.309352	DEF
t	4	14	398	398	2026-05-26 22:24:56.314352	DEF
t	2	14	399	399	2026-05-26 22:24:56.318355	MID
t	10	14	400	400	2026-05-26 22:24:56.323351	MID
t	17	14	401	401	2026-05-26 22:24:56.328353	MID
t	14	14	402	402	2026-05-26 22:24:56.332356	MID
t	13	14	403	403	2026-05-26 22:24:56.336355	MID
t	6	14	404	404	2026-05-26 22:24:56.340352	MID
t	\N	14	405	405	2026-05-26 22:24:56.345353	MID
t	7	14	406	406	2026-05-26 22:24:56.350354	MID
t	19	14	407	407	2026-05-26 22:24:56.354353	MID
t	6	14	408	408	2026-05-26 22:24:56.358352	FWD
t	11	14	409	409	2026-05-26 22:24:56.363355	FWD
t	19	14	410	410	2026-05-26 22:24:56.368162	FWD
t	10	14	411	411	2026-05-26 22:24:56.376115	FWD
t	8	14	412	412	2026-05-26 22:24:56.381399	FWD
t	\N	14	413	413	2026-05-26 22:24:56.386155	FWD
t	7	14	414	414	2026-05-26 22:24:56.392028	FWD
t	16	15	415	415	2026-05-26 22:24:56.39687	GK
t	1	15	416	416	2026-05-26 22:24:56.401071	GK
t	22	15	417	417	2026-05-26 22:24:56.406428	GK
t	1	15	418	418	2026-05-26 22:24:56.411157	GK
t	2	15	419	419	2026-05-26 22:24:56.415879	DEF
t	18	15	420	420	2026-05-26 22:24:56.420328	DEF
t	6	15	421	421	2026-05-26 22:24:56.425594	DEF
t	17	15	422	422	2026-05-26 22:24:56.430323	DEF
t	4	15	423	423	2026-05-26 22:24:56.435176	DEF
t	13	15	424	424	2026-05-26 22:24:56.439502	DEF
t	5	15	425	425	2026-05-26 22:24:56.443194	DEF
t	6	15	426	426	2026-05-26 22:24:56.447289	DEF
t	3	15	427	427	2026-05-26 22:24:56.451502	DEF
t	2	15	428	428	2026-05-26 22:24:56.4555	DEF
t	3	15	429	429	2026-05-26 22:24:56.459623	DEF
t	18	15	430	430	2026-05-26 22:24:56.463317	MID
t	14	15	431	431	2026-05-26 22:24:56.467617	MID
t	10	15	432	432	2026-05-26 22:24:56.472345	MID
t	12	15	433	433	2026-05-26 22:24:56.476559	MID
t	21	15	434	434	2026-05-26 22:24:56.48172	MID
t	23	15	435	435	2026-05-26 22:24:56.488035	MID
t	7	15	436	436	2026-05-26 22:24:56.493861	MID
t	13	15	437	437	2026-05-26 22:24:56.499942	MID
t	19	15	438	438	2026-05-26 22:24:56.506287	MID
t	15	15	439	439	2026-05-26 22:24:56.511902	MID
t	20	15	440	440	2026-05-26 22:24:56.518901	FWD
t	17	15	441	441	2026-05-26 22:24:56.524901	FWD
t	9	15	442	442	2026-05-26 22:24:56.5299	FWD
t	8	15	443	443	2026-05-26 22:24:56.5369	FWD
t	11	15	444	444	2026-05-26 22:24:56.5429	FWD
t	1	16	445	445	2026-05-26 22:25:28.080626	GK
t	22	16	446	446	2026-05-26 22:25:28.085424	GK
t	1	16	447	447	2026-05-26 22:25:28.089576	GK
t	23	16	448	448	2026-05-26 22:25:28.094578	DEF
t	26	16	449	449	2026-05-26 22:25:28.099577	DEF
t	3	16	450	450	2026-05-26 22:25:28.104575	DEF
t	5	16	451	451	2026-05-26 22:25:28.108575	DEF
t	13	16	452	452	2026-05-26 22:25:28.111575	DEF
t	4	16	453	453	2026-05-26 22:25:28.116575	DEF
t	5	16	454	454	2026-05-26 22:25:28.120577	DEF
t	5	16	455	455	2026-05-26 22:25:28.124577	DEF
t	23	16	456	456	2026-05-26 22:25:28.128578	DEF
t	18	16	457	457	2026-05-26 22:25:28.133575	DEF
t	14	16	458	458	2026-05-26 22:25:28.137576	MID
t	11	16	459	459	2026-05-26 22:25:28.141575	MID
t	21	16	460	460	2026-05-26 22:25:28.145575	MID
t	6	16	461	461	2026-05-26 22:25:28.149576	MID
t	8	16	462	462	2026-05-26 22:25:28.154576	FWD
t	16	16	463	463	2026-05-26 22:25:28.158575	FWD
t	10	16	464	464	2026-05-26 22:25:28.162575	FWD
t	7	16	465	465	2026-05-26 22:25:28.167575	FWD
t	\N	16	466	466	2026-05-26 22:25:28.171575	FWD
t	24	16	467	467	2026-05-26 22:25:28.175578	FWD
t	27	16	468	468	2026-05-26 22:25:28.180576	FWD
t	9	16	469	469	2026-05-26 22:25:28.183576	FWD
t	1	17	470	470	2026-05-26 22:25:28.188576	GK
t	22	17	471	471	2026-05-26 22:25:28.192576	GK
t	22	17	472	472	2026-05-26 22:25:28.198576	GK
t	21	17	473	473	2026-05-26 22:25:28.203577	GK
t	22	17	474	474	2026-05-26 22:25:28.20758	GK
t	21	17	475	475	2026-05-26 22:25:28.213576	GK
t	12	17	476	476	2026-05-26 22:25:28.218576	DEF
t	13	17	477	477	2026-05-26 22:25:28.223576	DEF
t	14	17	478	478	2026-05-26 22:25:28.229576	DEF
t	4	17	479	479	2026-05-26 22:25:28.234576	DEF
t	4	17	480	480	2026-05-26 22:25:28.239576	DEF
t	4	17	481	481	2026-05-26 22:25:28.244576	DEF
t	5	17	482	482	2026-05-26 22:25:28.249575	DEF
t	2	17	483	483	2026-05-26 22:25:28.253576	DEF
t	14	17	484	484	2026-05-26 22:25:28.257578	DEF
t	3	17	485	485	2026-05-26 22:25:28.262575	DEF
t	2	17	486	486	2026-05-26 22:25:28.266575	DEF
t	17	17	487	487	2026-05-26 22:25:28.270576	DEF
t	5	17	488	488	2026-05-26 22:25:28.275575	DEF
t	3	17	489	489	2026-05-26 22:25:28.279577	DEF
t	12	17	490	490	2026-05-26 22:25:28.284577	MID
t	18	17	491	491	2026-05-26 22:25:28.288576	MID
t	19	17	492	492	2026-05-26 22:25:28.294577	MID
t	6	17	493	493	2026-05-26 22:25:28.298579	MID
t	10	17	494	494	2026-05-26 22:25:28.303575	MID
t	7	17	495	495	2026-05-26 22:25:28.307576	MID
t	16	17	496	496	2026-05-26 22:25:28.312576	MID
t	8	17	497	497	2026-05-26 22:25:28.317576	MID
t	10	17	498	498	2026-05-26 22:25:28.321575	MID
t	15	17	499	499	2026-05-26 22:25:28.325576	MID
t	20	17	500	500	2026-05-26 22:25:28.329579	MID
t	23	17	501	501	2026-05-26 22:25:28.333576	MID
t	23	17	502	502	2026-05-26 22:25:28.338575	MID
t	6	17	503	503	2026-05-26 22:25:28.341576	MID
t	7	17	504	504	2026-05-26 22:25:28.346578	FWD
t	9	17	505	505	2026-05-26 22:25:28.352576	FWD
t	16	17	506	506	2026-05-26 22:25:28.359576	FWD
t	19	17	507	507	2026-05-26 22:25:28.364575	FWD
t	20	17	508	508	2026-05-26 22:25:28.369575	FWD
t	20	17	509	509	2026-05-26 22:25:28.374575	FWD
t	11	17	510	510	2026-05-26 22:25:28.377575	FWD
t	\N	17	511	511	2026-05-26 22:25:28.381579	FWD
t	8	17	512	512	2026-05-26 22:25:28.386576	FWD
t	22	18	513	513	2026-05-26 22:25:28.391576	GK
t	1	18	514	514	2026-05-26 22:25:28.395575	GK
t	12	18	515	515	2026-05-26 22:25:28.400578	GK
t	1	18	516	516	2026-05-26 22:25:28.406577	GK
t	22	18	517	517	2026-05-26 22:25:28.413577	GK
t	5	18	518	518	2026-05-26 22:25:28.419575	DEF
t	18	18	519	519	2026-05-26 22:25:28.423578	DEF
t	2	18	520	520	2026-05-26 22:25:28.428577	DEF
t	19	18	521	521	2026-05-26 22:25:28.434575	DEF
t	4	18	522	522	2026-05-26 22:25:28.438575	DEF
t	14	18	523	523	2026-05-26 22:25:28.442575	DEF
t	6	18	524	524	2026-05-26 22:25:28.447576	DEF
t	3	18	525	525	2026-05-26 22:25:28.451577	DEF
t	16	18	526	526	2026-05-26 22:25:28.455576	DEF
t	13	18	527	527	2026-05-26 22:25:28.458576	MID
t	8	18	528	528	2026-05-26 22:25:28.462578	MID
t	23	18	529	529	2026-05-26 22:25:28.466578	MID
t	8	18	530	530	2026-05-26 22:25:28.470576	MID
t	6	18	531	531	2026-05-26 22:25:28.474576	MID
t	15	18	532	532	2026-05-26 22:25:28.479575	MID
t	17	18	533	533	2026-05-26 22:25:28.483576	MID
t	6	18	534	534	2026-05-26 22:25:28.487576	MID
t	20	18	535	535	2026-05-26 22:25:28.492577	MID
t	15	18	536	536	2026-05-26 22:25:28.499576	MID
t	21	18	537	537	2026-05-26 22:25:28.503577	MID
t	10	18	538	538	2026-05-26 22:25:28.508576	MID
t	16	18	539	539	2026-05-26 22:25:28.512575	FWD
t	11	18	540	540	2026-05-26 22:25:28.517576	FWD
t	9	18	541	541	2026-05-26 22:25:28.521575	FWD
t	23	18	542	542	2026-05-26 22:25:28.527576	FWD
t	21	18	543	543	2026-05-26 22:25:28.532577	FWD
t	19	18	544	544	2026-05-26 22:25:28.537576	FWD
t	7	18	545	545	2026-05-26 22:25:28.542576	FWD
t	1	19	546	546	2026-05-26 22:25:28.547575	GK
t	21	19	547	547	2026-05-26 22:25:28.552575	GK
t	12	19	548	548	2026-05-26 22:25:28.558577	GK
t	3	19	549	549	2026-05-26 22:25:28.565576	DEF
t	18	19	550	550	2026-05-26 22:25:28.572577	DEF
t	22	19	551	551	2026-05-26 22:25:28.578575	DEF
t	2	19	552	552	2026-05-26 22:25:28.582583	DEF
t	15	19	553	553	2026-05-26 22:25:28.59175	DEF
t	4	19	554	554	2026-05-26 22:25:28.597044	DEF
t	2	19	555	555	2026-05-26 22:25:28.601857	DEF
t	2	19	556	556	2026-05-26 22:25:28.607232	DEF
t	8	19	557	557	2026-05-26 22:25:28.613565	MID
t	5	19	558	558	2026-05-26 22:25:28.619433	MID
t	21	19	559	559	2026-05-26 22:25:28.624684	MID
t	6	19	560	560	2026-05-26 22:25:28.630093	MID
t	16	19	561	561	2026-05-26 22:25:28.636959	MID
t	23	19	562	562	2026-05-26 22:25:28.641187	MID
t	16	19	563	563	2026-05-26 22:25:28.646556	MID
t	17	19	564	564	2026-05-26 22:25:28.6515	MID
t	11	19	565	565	2026-05-26 22:25:28.655166	FWD
t	20	19	566	566	2026-05-26 22:25:28.659362	FWD
t	7	19	567	567	2026-05-26 22:25:28.6648	FWD
t	19	19	568	568	2026-05-26 22:25:28.669003	FWD
t	13	19	569	569	2026-05-26 22:25:28.673266	FWD
t	11	19	570	570	2026-05-26 22:25:28.678628	FWD
t	23	20	571	571	2026-05-26 22:25:28.683358	GK
t	23	20	572	572	2026-05-26 22:25:28.687649	GK
t	12	20	573	573	2026-05-26 22:25:28.694754	GK
t	8	20	574	574	2026-05-26 22:25:28.700799	DEF
t	4	20	575	575	2026-05-26 22:25:28.705542	DEF
t	2	20	576	576	2026-05-26 22:25:28.710915	DEF
t	16	20	577	577	2026-05-26 22:25:28.71619	DEF
t	19	20	578	578	2026-05-26 22:25:28.722062	DEF
t	\N	20	579	579	2026-05-26 22:25:28.72846	DEF
t	13	20	580	580	2026-05-26 22:25:28.73503	DEF
t	6	20	581	581	2026-05-26 22:25:28.742182	DEF
t	3	20	582	582	2026-05-26 22:25:28.747977	DEF
t	3	20	583	583	2026-05-26 22:25:28.752895	MID
t	8	20	584	584	2026-05-26 22:25:28.758165	MID
t	20	20	585	585	2026-05-26 22:25:28.762783	MID
t	14	20	586	586	2026-05-26 22:25:28.76701	MID
t	5	20	587	587	2026-05-26 22:25:28.771827	MID
t	18	20	588	588	2026-05-26 22:25:28.776577	MID
t	22	20	589	589	2026-05-26 22:25:28.781335	MID
t	7	20	590	590	2026-05-26 22:25:28.786265	MID
t	16	20	591	591	2026-05-26 22:25:28.792077	FWD
t	9	20	592	592	2026-05-26 22:25:28.797346	FWD
t	15	20	593	593	2026-05-26 22:25:28.803734	FWD
t	13	20	594	594	2026-05-26 22:25:28.808993	FWD
t	10	20	595	595	2026-05-26 22:25:28.814949	FWD
t	10	20	596	596	2026-05-26 22:25:28.828154	FWD
t	20	20	597	597	2026-05-26 22:25:28.837293	FWD
t	17	20	598	598	2026-05-26 22:25:28.8448	FWD
t	12	21	599	599	2026-05-26 22:26:00.356104	GK
t	22	21	600	600	2026-05-26 22:26:00.360244	GK
t	12	21	601	601	2026-05-26 22:26:00.364443	GK
t	3	21	602	602	2026-05-26 22:26:00.368755	DEF
t	20	21	603	603	2026-05-26 22:26:00.37257	DEF
t	5	21	604	604	2026-05-26 22:26:00.377265	DEF
t	14	21	605	605	2026-05-26 22:26:00.380944	DEF
t	19	21	606	606	2026-05-26 22:26:00.385843	DEF
t	4	21	607	607	2026-05-26 22:26:00.390587	DEF
t	13	21	608	608	2026-05-26 22:26:00.394939	DEF
t	8	21	609	609	2026-05-26 22:26:00.399209	MID
t	8	21	610	610	2026-05-26 22:26:00.403402	MID
t	15	21	611	611	2026-05-26 22:26:00.408128	MID
t	21	21	612	612	2026-05-26 22:26:00.41235	MID
t	18	21	613	613	2026-05-26 22:26:00.416705	MID
t	17	21	614	614	2026-05-26 22:26:00.420904	MID
t	6	21	615	615	2026-05-26 22:26:00.424419	MID
t	23	21	616	616	2026-05-26 22:26:00.428421	MID
t	19	21	617	617	2026-05-26 22:26:00.433418	FWD
t	17	21	618	618	2026-05-26 22:26:00.437417	FWD
t	15	21	619	619	2026-05-26 22:26:00.44116	FWD
t	11	21	620	620	2026-05-26 22:26:00.445459	FWD
t	18	21	621	621	2026-05-26 22:26:00.449705	FWD
t	9	21	622	622	2026-05-26 22:26:00.45495	FWD
t	9	21	623	623	2026-05-26 22:26:00.45984	FWD
t	16	21	624	624	2026-05-26 22:26:00.464102	FWD
t	16	22	625	625	2026-05-26 22:26:00.469385	GK
t	\N	22	626	626	2026-05-26 22:26:00.474102	GK
t	16	22	627	627	2026-05-26 22:26:00.47892	GK
t	2	22	628	628	2026-05-26 22:26:00.48258	DEF
t	24	22	629	629	2026-05-26 22:26:00.487318	DEF
t	3	22	630	630	2026-05-26 22:26:00.492755	DEF
t	6	22	631	631	2026-05-26 22:26:00.496471	DEF
t	\N	22	632	632	2026-05-26 22:26:00.50071	DEF
t	17	22	633	633	2026-05-26 22:26:00.504388	DEF
t	4	22	634	634	2026-05-26 22:26:00.508676	DEF
t	3	22	635	635	2026-05-26 22:26:00.512873	DEF
t	20	22	636	636	2026-05-26 22:26:00.517599	DEF
t	15	22	637	637	2026-05-26 22:26:00.521865	MID
t	21	22	638	638	2026-05-26 22:26:00.52608	MID
t	11	22	639	639	2026-05-26 22:26:00.530289	MID
t	18	22	640	640	2026-05-26 22:26:00.535047	MID
t	10	22	641	641	2026-05-26 22:26:00.539961	MID
t	17	22	642	642	2026-05-26 22:26:00.544707	MID
t	8	22	643	643	2026-05-26 22:26:00.549447	MID
t	7	22	644	644	2026-05-26 22:26:00.553257	FWD
t	10	22	645	645	2026-05-26 22:26:00.557463	FWD
t	19	22	646	646	2026-05-26 22:26:00.561656	FWD
t	\N	22	647	647	2026-05-26 22:26:00.56562	FWD
t	9	22	648	648	2026-05-26 22:26:00.570455	FWD
t	8	22	649	649	2026-05-26 22:26:00.574681	FWD
t	26	22	650	650	2026-05-26 22:26:00.578892	FWD
t	18	23	651	651	2026-05-26 22:26:00.583734	GK
t	18	23	652	652	2026-05-26 22:26:00.587949	GK
t	1	23	653	653	2026-05-26 22:26:00.592685	GK
t	23	23	654	654	2026-05-26 22:26:00.598073	GK
t	3	23	655	655	2026-05-26 22:26:00.602427	DEF
t	15	23	656	656	2026-05-26 22:26:00.607169	DEF
t	3	23	657	657	2026-05-26 22:26:00.611921	DEF
t	5	23	658	658	2026-05-26 22:26:00.615911	DEF
t	21	23	659	659	2026-05-26 22:26:00.620911	DEF
t	3	23	660	660	2026-05-26 22:26:00.626157	DEF
t	8	23	661	661	2026-05-26 22:26:00.63154	DEF
t	3	23	662	662	2026-05-26 22:26:00.637347	DEF
t	2	23	663	663	2026-05-26 22:26:00.642765	DEF
t	4	23	664	664	2026-05-26 22:26:00.649823	DEF
t	2	23	665	665	2026-05-26 22:26:00.6556	DEF
t	19	23	666	666	2026-05-26 22:26:00.661929	DEF
t	2	23	667	667	2026-05-26 22:26:00.667251	DEF
t	10	23	668	668	2026-05-26 22:26:00.671462	MID
t	\N	23	669	669	2026-05-26 22:26:00.677966	MID
t	5	23	670	670	2026-05-26 22:26:00.682688	MID
t	16	23	671	671	2026-05-26 22:26:00.687692	MID
t	13	23	672	672	2026-05-26 22:26:00.695225	MID
t	14	23	673	673	2026-05-26 22:26:00.701032	MID
t	6	23	674	674	2026-05-26 22:26:00.706396	MID
t	13	23	675	675	2026-05-26 22:26:00.712725	MID
t	20	23	676	676	2026-05-26 22:26:00.719267	MID
t	21	23	677	677	2026-05-26 22:26:00.730502	MID
t	12	23	678	678	2026-05-26 22:26:00.738473	FWD
t	11	23	679	679	2026-05-26 22:26:00.743731	FWD
t	17	23	680	680	2026-05-26 22:26:00.747936	FWD
t	11	23	681	681	2026-05-26 22:26:00.758514	FWD
t	22	23	682	682	2026-05-26 22:26:00.766515	FWD
t	22	23	683	683	2026-05-26 22:26:00.770514	FWD
t	7	23	684	684	2026-05-26 22:26:00.774517	FWD
t	7	23	685	685	2026-05-26 22:26:00.778517	FWD
t	9	23	686	686	2026-05-26 22:26:00.782514	FWD
t	7	23	687	687	2026-05-26 22:26:00.787515	FWD
t	22	24	688	688	2026-05-26 22:26:00.792516	GK
t	12	24	689	689	2026-05-26 22:26:00.798516	GK
t	1	24	690	690	2026-05-26 22:26:00.803518	GK
t	12	24	691	691	2026-05-26 22:26:00.808515	GK
t	5	24	692	692	2026-05-26 22:26:00.813514	DEF
t	27	24	693	693	2026-05-26 22:26:00.822515	DEF
t	4	24	694	694	2026-05-26 22:26:00.829516	DEF
t	15	24	695	695	2026-05-26 22:26:00.834514	DEF
t	3	24	696	696	2026-05-26 22:26:00.840514	DEF
t	3	24	697	697	2026-05-26 22:26:00.846515	DEF
t	11	24	698	698	2026-05-26 22:26:00.852516	DEF
t	18	24	699	699	2026-05-26 22:26:00.858514	DEF
t	2	24	700	700	2026-05-26 22:26:00.862514	DEF
t	4	24	701	701	2026-05-26 22:26:00.867514	DEF
t	3	24	702	702	2026-05-26 22:26:00.871515	DEF
t	6	24	703	703	2026-05-26 22:26:00.876515	DEF
t	26	24	704	704	2026-05-26 22:26:00.881517	DEF
t	21	24	705	705	2026-05-26 22:26:00.885515	MID
t	4	24	706	706	2026-05-26 22:26:00.890515	MID
t	28	24	707	707	2026-05-26 22:26:00.895515	MID
t	15	24	708	708	2026-05-26 22:26:00.900515	MID
t	10	24	709	709	2026-05-26 22:26:00.905514	MID
t	24	24	710	710	2026-05-26 22:26:00.909516	MID
t	23	24	711	711	2026-05-26 22:26:00.914515	MID
t	\N	24	712	712	2026-05-26 22:26:00.918514	MID
t	6	24	713	713	2026-05-26 22:26:00.928564	MID
t	8	24	714	714	2026-05-26 22:26:00.93436	MID
t	11	24	715	715	2026-05-26 22:26:00.939769	MID
t	14	24	716	716	2026-05-26 22:26:00.945561	MID
t	17	24	717	717	2026-05-26 22:26:00.950263	MID
t	16	24	718	718	2026-05-26 22:26:00.956169	FWD
t	13	24	719	719	2026-05-26 22:26:00.96246	FWD
t	20	24	720	720	2026-05-26 22:26:00.966975	FWD
t	19	24	721	721	2026-05-26 22:26:00.972973	FWD
t	17	24	722	722	2026-05-26 22:26:00.976975	FWD
t	7	24	723	723	2026-05-26 22:26:00.981971	FWD
t	9	24	724	724	2026-05-26 22:26:00.988495	FWD
t	21	24	725	725	2026-05-26 22:26:00.99449	FWD
t	21	24	726	726	2026-05-26 22:26:00.99949	FWD
t	1	25	727	727	2026-05-26 22:26:01.00449	GK
t	21	25	728	728	2026-05-26 22:26:01.008493	GK
t	21	25	729	729	2026-05-26 22:26:01.012493	GK
t	12	25	730	730	2026-05-26 22:26:01.017491	GK
t	5	25	731	731	2026-05-26 22:26:01.021492	DEF
t	13	25	732	732	2026-05-26 22:26:01.024493	DEF
t	2	25	733	733	2026-05-26 22:26:01.02849	DEF
t	4	25	734	734	2026-05-26 22:26:01.03249	DEF
t	15	25	735	735	2026-05-26 22:26:01.03649	DEF
t	4	25	736	736	2026-05-26 22:26:01.039794	DEF
t	2	25	737	737	2026-05-26 22:26:01.044009	DEF
t	14	25	738	738	2026-05-26 22:26:01.04824	DEF
t	6	25	739	739	2026-05-26 22:26:01.051898	DEF
t	3	25	740	740	2026-05-26 22:26:01.056107	DEF
t	23	25	741	741	2026-05-26 22:26:01.059767	MID
t	16	25	742	742	2026-05-26 22:26:01.064085	MID
t	17	25	743	743	2026-05-26 22:26:01.067768	MID
t	20	25	744	744	2026-05-26 22:26:01.071607	MID
t	17	25	745	745	2026-05-26 22:26:01.075282	MID
t	22	25	746	746	2026-05-26 22:26:01.079586	MID
t	8	25	747	747	2026-05-26 22:26:01.083799	MID
t	7	25	748	748	2026-05-26 22:26:01.08801	FWD
t	10	25	749	749	2026-05-26 22:26:01.092292	FWD
t	18	25	750	750	2026-05-26 22:26:01.098197	FWD
t	11	25	751	751	2026-05-26 22:26:01.102929	FWD
t	9	25	752	752	2026-05-26 22:26:01.107664	FWD
t	13	25	753	753	2026-05-26 22:26:01.113396	FWD
t	19	25	754	754	2026-05-26 22:26:01.117587	FWD
t	13	26	755	755	2026-05-26 22:26:32.63206	GK
t	23	26	756	756	2026-05-26 22:26:32.636244	GK
t	1	26	757	757	2026-05-26 22:26:32.640425	GK
t	5	26	758	758	2026-05-26 22:26:32.645788	DEF
t	22	26	759	759	2026-05-26 22:26:32.650073	DEF
t	2	26	760	760	2026-05-26 22:26:32.654256	DEF
t	4	26	761	761	2026-05-26 22:26:32.658452	DEF
t	6	26	762	762	2026-05-26 22:26:32.663266	DEF
t	4	26	763	763	2026-05-26 22:26:32.667045	DEF
t	12	26	764	764	2026-05-26 22:26:32.67121	DEF
t	15	26	765	765	2026-05-26 22:26:32.675486	DEF
t	12	26	766	766	2026-05-26 22:26:32.679532	MID
t	8	26	767	767	2026-05-26 22:26:32.686535	MID
t	20	26	768	768	2026-05-26 22:26:32.691686	MID
t	14	26	769	769	2026-05-26 22:26:32.696417	MID
t	16	26	770	770	2026-05-26 22:26:32.700093	MID
t	7	26	771	771	2026-05-26 22:26:32.704277	MID
t	8	26	772	772	2026-05-26 22:26:32.708539	MID
t	12	26	773	773	2026-05-26 22:26:32.712312	MID
t	22	26	774	774	2026-05-26 22:26:32.715991	MID
t	9	26	775	775	2026-05-26 22:26:32.720711	FWD
t	11	26	776	776	2026-05-26 22:26:32.725147	FWD
t	17	26	777	777	2026-05-26 22:26:32.729858	FWD
t	18	26	778	778	2026-05-26 22:26:32.734036	FWD
t	9	26	779	779	2026-05-26 22:26:32.738878	FWD
t	12	27	780	780	2026-05-26 22:26:32.743068	GK
t	16	27	781	781	2026-05-26 22:26:32.747275	GK
t	1	27	782	782	2026-05-26 22:26:32.751487	GK
t	4	27	783	783	2026-05-26 22:26:32.756854	DEF
t	21	27	784	784	2026-05-26 22:26:32.761553	DEF
t	23	27	785	785	2026-05-26 22:26:32.765753	DEF
t	\N	27	786	786	2026-05-26 22:26:32.770766	DEF
t	3	27	787	787	2026-05-26 22:26:32.776045	DEF
t	14	27	788	788	2026-05-26 22:26:32.779831	DEF
t	18	27	789	789	2026-05-26 22:26:32.784822	DEF
t	15	27	790	790	2026-05-26 22:26:32.788433	DEF
t	\N	27	791	791	2026-05-26 22:26:32.794282	DEF
t	\N	27	792	792	2026-05-26 22:26:32.799137	DEF
t	15	27	793	793	2026-05-26 22:26:32.805459	MID
t	5	27	794	794	2026-05-26 22:26:32.811272	MID
t	8	27	795	795	2026-05-26 22:26:32.817188	MID
t	8	27	796	796	2026-05-26 22:26:32.82785	MID
t	3	27	797	797	2026-05-26 22:26:32.834053	MID
t	\N	27	798	798	2026-05-26 22:26:32.838233	FWD
t	13	27	799	799	2026-05-26 22:26:32.842934	MID
t	9	27	800	800	2026-05-26 22:26:32.847237	FWD
t	17	27	801	801	2026-05-26 22:26:32.852496	FWD
t	7	27	802	802	2026-05-26 22:26:32.856323	FWD
t	18	27	803	803	2026-05-26 22:26:32.860607	FWD
t	\N	27	804	804	2026-05-26 22:26:32.865316	FWD
t	22	27	805	805	2026-05-26 22:26:32.869502	FWD
t	16	28	806	806	2026-05-26 22:26:32.873804	GK
t	23	28	807	807	2026-05-26 22:26:32.878092	GK
t	\N	28	808	808	2026-05-26 22:26:32.882298	GK
t	25	28	809	809	2026-05-26 22:26:32.886329	GK
t	12	28	810	810	2026-05-26 22:26:32.890327	DEF
t	\N	28	811	811	2026-05-26 22:26:32.895328	DEF
t	\N	28	812	812	2026-05-26 22:26:32.901577	DEF
t	\N	28	813	813	2026-05-26 22:26:32.905779	DEF
t	17	28	814	814	2026-05-26 22:26:32.911149	DEF
t	3	28	815	815	2026-05-26 22:26:32.915888	DEF
t	\N	28	816	816	2026-05-26 22:26:32.920068	DEF
t	18	28	817	817	2026-05-26 22:26:32.926568	DEF
t	13	28	818	818	2026-05-26 22:26:32.931844	DEF
t	21	28	819	819	2026-05-26 22:26:32.936032	MID
t	15	28	820	820	2026-05-26 22:26:32.940918	MID
t	6	28	821	821	2026-05-26 22:26:32.945665	MID
t	27	28	822	822	2026-05-26 22:26:32.949333	MID
t	\N	28	823	823	2026-05-26 22:26:32.953707	MID
t	20	28	824	824	2026-05-26 22:26:32.957926	MID
t	21	28	825	825	2026-05-26 22:26:32.961971	FWD
t	26	28	826	826	2026-05-26 22:26:32.966961	FWD
t	10	28	827	827	2026-05-26 22:26:32.97196	FWD
t	14	28	828	828	2026-05-26 22:26:32.976961	FWD
t	2	28	829	829	2026-05-26 22:26:32.98096	FWD
t	9	28	830	830	2026-05-26 22:26:32.984961	FWD
t	21	29	831	831	2026-05-26 22:26:32.989961	GK
t	22	29	832	832	2026-05-26 22:26:32.994604	GK
t	1	29	833	833	2026-05-26 22:26:32.998862	GK
t	14	29	834	834	2026-05-26 22:26:33.005237	DEF
t	18	29	835	835	2026-05-26 22:26:33.012306	DEF
t	4	29	836	836	2026-05-26 22:26:33.018726	DEF
t	13	29	837	837	2026-05-26 22:26:33.024009	DEF
t	15	29	838	838	2026-05-26 22:26:33.02874	DEF
t	8	29	839	839	2026-05-26 22:26:33.034736	DEF
t	3	29	840	840	2026-05-26 22:26:33.038932	DEF
t	23	29	841	841	2026-05-26 22:26:33.04472	DEF
t	17	29	842	842	2026-05-26 22:26:33.049862	MID
t	12	29	843	843	2026-05-26 22:26:33.054863	MID
t	20	29	844	844	2026-05-26 22:26:33.059862	MID
t	6	29	845	845	2026-05-26 22:26:33.065862	MID
t	2	29	846	846	2026-05-26 22:26:33.070862	MID
t	5	29	847	847	2026-05-26 22:26:33.075862	MID
t	4	29	848	848	2026-05-26 22:26:33.081863	MID
t	10	29	849	849	2026-05-26 22:26:33.086864	FWD
t	7	29	850	850	2026-05-26 22:26:33.092862	FWD
t	11	29	851	851	2026-05-26 22:26:33.099863	FWD
t	11	29	852	852	2026-05-26 22:26:33.110811	FWD
t	9	29	853	853	2026-05-26 22:26:33.115608	FWD
t	22	30	854	854	2026-05-26 22:26:33.120325	GK
t	1	30	855	855	2026-05-26 22:26:33.125746	GK
t	1	30	856	856	2026-05-26 22:26:33.130507	GK
t	12	30	857	857	2026-05-26 22:26:33.135761	GK
t	22	30	858	858	2026-05-26 22:26:33.141747	GK
t	7	30	859	859	2026-05-26 22:26:33.146751	DEF
t	3	30	860	860	2026-05-26 22:26:33.151749	DEF
t	24	30	861	861	2026-05-26 22:26:33.15775	DEF
t	7	30	862	862	2026-05-26 22:26:33.162749	DEF
t	4	30	863	863	2026-05-26 22:26:33.167748	DEF
t	6	30	864	864	2026-05-26 22:26:33.17275	DEF
t	5	30	865	865	2026-05-26 22:26:33.17875	DEF
t	17	30	866	866	2026-05-26 22:26:33.182751	DEF
t	5	30	867	867	2026-05-26 22:26:33.187749	DEF
t	2	30	868	868	2026-05-26 22:26:33.194752	DEF
t	18	30	869	869	2026-05-26 22:26:33.200749	MID
t	23	30	870	870	2026-05-26 22:26:33.206749	MID
t	16	30	871	871	2026-05-26 22:26:33.211748	MID
t	21	30	872	872	2026-05-26 22:26:33.216748	MID
t	16	30	873	873	2026-05-26 22:26:33.221748	MID
t	10	30	874	874	2026-05-26 22:26:33.225748	MID
t	11	30	875	875	2026-05-26 22:26:33.230749	MID
t	\N	30	876	876	2026-05-26 22:26:33.235749	MID
t	15	30	877	877	2026-05-26 22:26:33.240751	MID
t	9	30	878	878	2026-05-26 22:26:33.244749	MID
t	20	30	879	879	2026-05-26 22:26:33.248749	FWD
t	19	30	880	880	2026-05-26 22:26:33.252748	FWD
t	18	30	881	881	2026-05-26 22:26:33.257149	FWD
t	8	30	882	882	2026-05-26 22:26:33.261346	FWD
t	9	30	883	883	2026-05-26 22:26:33.266236	FWD
t	18	30	884	884	2026-05-26 22:26:33.269923	FWD
t	14	30	885	885	2026-05-26 22:26:33.274133	FWD
t	19	30	886	886	2026-05-26 22:26:33.278191	FWD
t	20	30	887	887	2026-05-26 22:26:33.283017	FWD
t	13	30	888	888	2026-05-26 22:26:33.287237	FWD
t	26	31	889	889	2026-05-26 22:26:45.897233	GK
t	\N	31	890	890	2026-05-26 22:26:45.9009	GK
t	25	31	891	891	2026-05-26 22:26:45.905107	GK
t	1	31	892	892	2026-05-26 22:26:45.90877	GK
t	18	31	893	893	2026-05-26 22:26:45.914086	GK
t	1	31	894	894	2026-05-26 22:26:45.917761	GK
t	2	31	895	895	2026-05-26 22:26:45.92144	DEF
t	16	31	896	896	2026-05-26 22:26:45.925834	DEF
t	22	31	897	897	2026-05-26 22:26:45.930587	DEF
t	13	31	898	898	2026-05-26 22:26:45.93425	DEF
t	3	31	899	899	2026-05-26 22:26:45.938961	DEF
t	5	31	900	900	2026-05-26 22:26:45.942718	DEF
t	12	31	901	901	2026-05-26 22:26:45.947393	DEF
t	19	31	902	902	2026-05-26 22:26:45.951586	DEF
t	2	31	903	903	2026-05-26 22:26:45.955256	DEF
t	2	31	904	904	2026-05-26 22:26:45.960065	DEF
t	11	31	905	905	2026-05-26 22:26:45.964209	MID
t	8	31	906	906	2026-05-26 22:26:45.967898	MID
t	15	31	907	907	2026-05-26 22:26:45.972726	MID
t	10	31	908	908	2026-05-26 22:26:45.977441	MID
t	8	31	909	909	2026-05-26 22:26:45.981107	MID
t	16	31	910	910	2026-05-26 22:26:45.985785	MID
t	7	31	911	911	2026-05-26 22:26:45.991207	MID
t	10	31	912	912	2026-05-26 22:26:45.996992	MID
t	11	31	913	913	2026-05-26 22:26:46.001805	MID
t	17	31	914	914	2026-05-26 22:26:46.005965	MID
t	26	31	915	915	2026-05-26 22:26:46.010296	MID
t	21	31	916	916	2026-05-26 22:26:46.014497	MID
t	24	31	917	917	2026-05-26 22:26:46.019271	FWD
t	18	31	918	918	2026-05-26 22:26:46.022976	FWD
t	20	31	919	919	2026-05-26 22:26:46.027159	FWD
t	9	31	920	920	2026-05-26 22:26:46.030807	FWD
t	10	31	921	921	2026-05-26 22:26:46.035651	FWD
t	19	31	922	922	2026-05-26 22:26:46.039819	FWD
t	16	32	923	923	2026-05-26 22:26:46.044039	GK
t	\N	32	924	924	2026-05-26 22:26:46.048345	GK
t	1	32	925	925	2026-05-26 22:26:46.053058	GK
t	16	32	926	926	2026-05-26 22:26:46.057778	GK
t	1	32	927	927	2026-05-26 22:26:46.062616	GK
t	2	32	928	928	2026-05-26 22:26:46.06682	DEF
t	3	32	929	929	2026-05-26 22:26:46.071	DEF
t	13	32	930	930	2026-05-26 22:26:46.075172	DEF
t	15	32	931	931	2026-05-26 22:26:46.086854	DEF
t	22	32	932	932	2026-05-26 22:26:46.092676	DEF
t	\N	32	933	933	2026-05-26 22:26:46.097893	DEF
t	4	32	934	934	2026-05-26 22:26:46.107331	DEF
t	5	32	935	935	2026-05-26 22:26:46.114286	DEF
t	20	32	936	936	2026-05-26 22:26:46.118452	MID
t	17	32	937	937	2026-05-26 22:26:46.12222	MID
t	6	32	938	938	2026-05-26 22:26:46.127114	MID
t	7	32	939	939	2026-05-26 22:26:46.131313	MID
t	18	32	940	940	2026-05-26 22:26:46.135528	MID
t	\N	32	941	941	2026-05-26 22:26:46.139603	MID
t	8	32	942	942	2026-05-26 22:26:46.143601	MID
t	21	32	943	943	2026-05-26 22:26:46.147599	MID
t	8	32	944	944	2026-05-26 22:26:46.151599	MID
t	19	32	945	945	2026-05-26 22:26:46.157598	MID
t	23	32	946	946	2026-05-26 22:26:46.1636	MID
t	\N	32	947	947	2026-05-26 22:26:46.168598	MID
t	9	32	948	948	2026-05-26 22:26:46.1736	FWD
t	11	32	949	949	2026-05-26 22:26:46.177601	FWD
t	19	32	950	950	2026-05-26 22:26:46.1826	FWD
t	10	32	951	951	2026-05-26 22:26:46.188599	FWD
t	24	32	952	952	2026-05-26 22:26:46.194598	FWD
t	10	32	953	953	2026-05-26 22:26:46.1996	FWD
t	11	32	954	954	2026-05-26 22:26:46.2066	FWD
t	9	32	955	955	2026-05-26 22:26:46.211602	FWD
t	23	32	956	956	2026-05-26 22:26:46.216599	FWD
t	25	32	957	957	2026-05-26 22:26:46.223598	FWD
t	12	32	958	958	2026-05-26 22:26:46.228598	FWD
t	\N	32	959	959	2026-05-26 22:26:46.234599	FWD
t	12	32	960	960	2026-05-26 22:26:46.241599	FWD
t	14	32	961	961	2026-05-26 22:26:46.247599	FWD
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: batch_job_execution_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.batch_job_execution_seq', 13, true);


--
-- Name: batch_job_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.batch_job_seq', 13, true);


--
-- Name: batch_step_execution_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.batch_step_execution_seq', 36, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.countries_id_seq', 32, true);


--
-- Name: match_lineup_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.match_lineup_entries_id_seq', 36, true);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.matches_id_seq', 2, true);


--
-- Name: player_season_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.player_season_stats_id_seq', 1, false);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.players_id_seq', 961, true);


--
-- Name: squad_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pitchlog
--

SELECT pg_catalog.setval('public.squad_entries_id_seq', 961, true);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: batch_job_execution_context batch_job_execution_context_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_execution_context
    ADD CONSTRAINT batch_job_execution_context_pkey PRIMARY KEY (job_execution_id);


--
-- Name: batch_job_execution batch_job_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_execution
    ADD CONSTRAINT batch_job_execution_pkey PRIMARY KEY (job_execution_id);


--
-- Name: batch_job_instance batch_job_instance_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_instance
    ADD CONSTRAINT batch_job_instance_pkey PRIMARY KEY (job_instance_id);


--
-- Name: batch_step_execution_context batch_step_execution_context_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_step_execution_context
    ADD CONSTRAINT batch_step_execution_context_pkey PRIMARY KEY (step_execution_id);


--
-- Name: batch_step_execution batch_step_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_step_execution
    ADD CONSTRAINT batch_step_execution_pkey PRIMARY KEY (step_execution_id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: batch_job_instance job_inst_un; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_instance
    ADD CONSTRAINT job_inst_un UNIQUE (job_name, job_key);


--
-- Name: match_lineup_entries match_lineup_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.match_lineup_entries
    ADD CONSTRAINT match_lineup_entries_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: player_season_stats player_season_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.player_season_stats
    ADD CONSTRAINT player_season_stats_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: squad_entries squad_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.squad_entries
    ADD CONSTRAINT squad_entries_pkey PRIMARY KEY (id);


--
-- Name: matches uk_bf7rc4o41v4o9wgxvi6x32cji; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT uk_bf7rc4o41v4o9wgxvi6x32cji UNIQUE (fixture_id);


--
-- Name: admin_users uq_admin_users_username; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT uq_admin_users_username UNIQUE (username);


--
-- Name: countries uq_countries_code; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT uq_countries_code UNIQUE (code);


--
-- Name: match_lineup_entries uq_match_lineup; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.match_lineup_entries
    ADD CONSTRAINT uq_match_lineup UNIQUE (fixture_id, player_api_id, team_api_id);


--
-- Name: player_season_stats uq_player_season_stats; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.player_season_stats
    ADD CONSTRAINT uq_player_season_stats UNIQUE (player_id, team_api_id, league_api_id, season_year);


--
-- Name: players uq_players_api_id; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT uq_players_api_id UNIQUE (api_player_id);


--
-- Name: squad_entries uq_squad_entries; Type: CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.squad_entries
    ADD CONSTRAINT uq_squad_entries UNIQUE (player_id, country_id);


--
-- Name: player_season_stats fk8eg203cu08bblus04aciaqhu0; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.player_season_stats
    ADD CONSTRAINT fk8eg203cu08bblus04aciaqhu0 FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: squad_entries fklbk1y06auvrac79vq7gpuxstt; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.squad_entries
    ADD CONSTRAINT fklbk1y06auvrac79vq7gpuxstt FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: squad_entries fkpysg28xrlch0jlf8b699mdd23; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.squad_entries
    ADD CONSTRAINT fkpysg28xrlch0jlf8b699mdd23 FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: batch_job_execution_context job_exec_ctx_fk; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_execution_context
    ADD CONSTRAINT job_exec_ctx_fk FOREIGN KEY (job_execution_id) REFERENCES public.batch_job_execution(job_execution_id);


--
-- Name: batch_job_execution_params job_exec_params_fk; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_execution_params
    ADD CONSTRAINT job_exec_params_fk FOREIGN KEY (job_execution_id) REFERENCES public.batch_job_execution(job_execution_id);


--
-- Name: batch_step_execution job_exec_step_fk; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_step_execution
    ADD CONSTRAINT job_exec_step_fk FOREIGN KEY (job_execution_id) REFERENCES public.batch_job_execution(job_execution_id);


--
-- Name: batch_job_execution job_inst_exec_fk; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_job_execution
    ADD CONSTRAINT job_inst_exec_fk FOREIGN KEY (job_instance_id) REFERENCES public.batch_job_instance(job_instance_id);


--
-- Name: batch_step_execution_context step_exec_ctx_fk; Type: FK CONSTRAINT; Schema: public; Owner: pitchlog
--

ALTER TABLE ONLY public.batch_step_execution_context
    ADD CONSTRAINT step_exec_ctx_fk FOREIGN KEY (step_execution_id) REFERENCES public.batch_step_execution(step_execution_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 3SDgcdfbVKbbMiCphLcflhtteaZZhyn4rsuTpfdCvMEDanIDifeXVZfQGepXDnO

