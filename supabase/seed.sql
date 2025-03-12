SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a18dff28-c6ca-4dee-8ae8-212db87c4306', '{"action":"user_signedup","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-03-10 13:39:43.632671+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e1f3f59-e70f-4a6f-be37-116cbb0b56ee', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:39:43.638371+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acfd0fb6-0a6a-438d-abc6-3e8c3b760939', '{"action":"user_recovery_requested","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-03-10 13:40:06.677269+00', ''),
	('00000000-0000-0000-0000-000000000000', '870d10ad-4a3b-4215-9e66-11a11af5d16c', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-10 13:40:17.271977+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3846559-23b1-40d8-861f-5a113f3d62b5', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:40:47.466423+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e9cb3d2-59ab-407a-a83e-abb970774346', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:40:50.401795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed4d9e70-a0bb-4f6c-827c-de872461ed6e', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:40:51.37154+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b241e8a1-a26a-4794-8baa-42cf0fb775d3', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:40:51.746123+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a3ee7d1-f315-4f67-bdb5-65f03b369dff', '{"action":"login","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-10 13:40:52.051938+00', ''),
	('00000000-0000-0000-0000-000000000000', '4627206a-e587-42e8-be82-6788adc661e3', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 14:43:36.592349+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8396615-72d5-405f-8601-53005929012f', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 14:43:36.597816+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd37d329-d433-4464-baee-138e679f19b9', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 15:43:49.336901+00', ''),
	('00000000-0000-0000-0000-000000000000', '6773fd8d-1b9e-4589-aaca-f7073e6bde61', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 15:43:49.371058+00', ''),
	('00000000-0000-0000-0000-000000000000', '779c6aa2-7689-4933-b16b-efbf0e39dc11', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 16:44:01.581432+00', ''),
	('00000000-0000-0000-0000-000000000000', '92162c50-e96d-41c5-8ddb-93e2a49aa575', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 16:44:01.586714+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e7baeee-44f7-4ece-bb0d-bccdca24cada', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 17:44:13.558517+00', ''),
	('00000000-0000-0000-0000-000000000000', '905c013f-bb35-4a6f-8753-7e89cd7441ac', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 17:44:13.559377+00', ''),
	('00000000-0000-0000-0000-000000000000', '2527ee21-496c-4b89-80c6-c38e6a8534ff', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 18:44:25.596685+00', ''),
	('00000000-0000-0000-0000-000000000000', '2088c989-5599-49b5-8703-df681222cd36', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 18:44:25.60075+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3795dd9-9c62-4f08-b8c2-39ec6c97e373', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 19:44:37.594373+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a0c667a-4b79-44d5-8476-c706ccb3e948', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 19:44:37.595257+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bd2668b-8591-4343-a240-43896812866b', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 20:44:49.564917+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1a1b629-2da0-48a5-b628-a85ce279f9bb', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 20:44:49.565829+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5e150c3-1572-4426-abda-7239036996cb', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 21:45:01.638438+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac2061e7-1920-4408-97ae-df346a5253f4', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 21:45:01.639146+00', ''),
	('00000000-0000-0000-0000-000000000000', '93345b73-389a-438a-b067-b2ce6e7a4842', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 22:45:13.666663+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f297fa9-19c1-4770-9083-4086348b34aa', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 22:45:13.66793+00', ''),
	('00000000-0000-0000-0000-000000000000', '94faadb3-d2d0-4c95-80b8-bf9099472a2d', '{"action":"token_refreshed","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 23:45:25.615517+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da041dbe-5fb5-4cbb-9ba4-a3e2663edf24', '{"action":"token_revoked","actor_id":"01511b97-44b3-4aee-a4dd-fe0377c0f476","actor_username":"sammatwong@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-10 23:45:25.61642+00', ''),
	('00000000-0000-0000-0000-000000000000', 'deb1384d-b2ab-4a9e-882a-3ec44d35ef92', '{"action":"user_signedup","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-03-12 01:37:29.673771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f656a9fc-35db-4719-97a3-7f4552da52ad', '{"action":"login","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-12 01:37:29.705588+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1722fb3-349f-4aba-a5f6-00738a741e08', '{"action":"user_recovery_requested","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-03-12 01:37:29.728633+00', ''),
	('00000000-0000-0000-0000-000000000000', '1baa13ed-e736-480a-b65b-cb3b6eef00df', '{"action":"login","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-12 01:38:20.153318+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9259a4e-6093-477e-ba11-c0a0855c8f79', '{"action":"user_recovery_requested","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-03-12 01:44:55.176148+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4e82c84-5dda-4687-9871-93a13cc9bfe4', '{"action":"login","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-12 01:45:25.893479+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d80ac10-0025-4fab-8cf0-8fe8cf13946a', '{"action":"logout","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-12 01:59:35.61692+00', ''),
	('00000000-0000-0000-0000-000000000000', '415464ff-9a8e-4b64-a0c3-777e300d660d', '{"action":"user_recovery_requested","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-03-12 01:59:56.85692+00', ''),
	('00000000-0000-0000-0000-000000000000', '873ddb30-f66b-4b2e-9cec-4563549574ee', '{"action":"login","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-12 02:00:11.752221+00', ''),
	('00000000-0000-0000-0000-000000000000', '33111da9-b64f-4825-b5b8-2bfe3582e4ba', '{"action":"logout","actor_id":"00caa582-fe48-40c0-9b0c-d0e1701bb423","actor_username":"test@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-12 02:20:28.924789+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '01511b97-44b3-4aee-a4dd-fe0377c0f476', 'authenticated', 'authenticated', 'sammatwong@gmail.com', '$2a$10$1VxoBJuj2PXo7DlrXg9o1uHkVBZM17gnCBIZ4bkTRUWeys3w0034q', '2025-03-10 13:39:43.635312+00', NULL, '', NULL, '', '2025-03-10 13:40:06.678517+00', '', '', NULL, '2025-03-10 13:40:52.052534+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "01511b97-44b3-4aee-a4dd-fe0377c0f476", "email": "sammatwong@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-03-10 13:39:43.606526+00', '2025-03-10 23:45:25.61828+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00caa582-fe48-40c0-9b0c-d0e1701bb423', 'authenticated', 'authenticated', 'test@gmail.com', '$2a$10$NtPxOz2PyzYDCQzONfyIPuzLYDZFX0wiDjfTyEFXet5L0PhnXvfGq', '2025-03-12 01:37:29.696181+00', NULL, '', NULL, '', '2025-03-12 01:59:56.861969+00', '', '', NULL, '2025-03-12 02:00:11.757134+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "00caa582-fe48-40c0-9b0c-d0e1701bb423", "email": "test@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-03-12 01:37:29.611472+00', '2025-03-12 02:00:11.766955+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('01511b97-44b3-4aee-a4dd-fe0377c0f476', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '{"sub": "01511b97-44b3-4aee-a4dd-fe0377c0f476", "email": "sammatwong@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-03-10 13:39:43.629747+00', '2025-03-10 13:39:43.629792+00', '2025-03-10 13:39:43.629792+00', '7222c169-3100-496d-9974-0e1c5b3cc8a2'),
	('00caa582-fe48-40c0-9b0c-d0e1701bb423', '00caa582-fe48-40c0-9b0c-d0e1701bb423', '{"sub": "00caa582-fe48-40c0-9b0c-d0e1701bb423", "email": "test@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-03-12 01:37:29.664402+00', '2025-03-12 01:37:29.664443+00', '2025-03-12 01:37:29.664443+00', '1cabbdc8-dfd4-4eb3-974c-2d727a0c9e97');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c7402ee1-6110-4a8b-b06e-88804e50d56c', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:39:43.63998+00', '2025-03-10 13:39:43.63998+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('73268ad2-1e32-4546-8053-b0e2c88faf54', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:17.275619+00', '2025-03-10 13:40:17.275619+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0', '192.168.65.1', NULL),
	('0c85ad27-79ec-49e3-a82f-e6e3457ba5fc', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:47.467626+00', '2025-03-10 13:40:47.467626+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('b2c3c472-8c58-4f5e-9cf1-67b52bf03e76', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:50.402524+00', '2025-03-10 13:40:50.402524+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('bb5c6807-795e-47b0-ae4e-2a24453a1624', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:51.372189+00', '2025-03-10 13:40:51.372189+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('c0cd350d-bb03-4d84-ab51-98bbe7ef33d2', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:51.746558+00', '2025-03-10 13:40:51.746558+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1', '01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:40:52.0526+00', '2025-03-10 23:45:25.619239+00', NULL, 'aal1', NULL, '2025-03-10 23:45:25.619206', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c7402ee1-6110-4a8b-b06e-88804e50d56c', '2025-03-10 13:39:43.647599+00', '2025-03-10 13:39:43.647599+00', 'password', '6cd667cb-2d54-4fcc-a949-7a828a19821c'),
	('73268ad2-1e32-4546-8053-b0e2c88faf54', '2025-03-10 13:40:17.280931+00', '2025-03-10 13:40:17.280931+00', 'otp', 'dd41f952-bd8e-4c6d-b368-2c48df0b8def'),
	('0c85ad27-79ec-49e3-a82f-e6e3457ba5fc', '2025-03-10 13:40:47.469624+00', '2025-03-10 13:40:47.469624+00', 'password', 'f65313c2-3faf-417b-a185-1eba63adcd24'),
	('b2c3c472-8c58-4f5e-9cf1-67b52bf03e76', '2025-03-10 13:40:50.403875+00', '2025-03-10 13:40:50.403875+00', 'password', 'c96f4edb-0f92-4dac-a0ce-6341867d12a8'),
	('bb5c6807-795e-47b0-ae4e-2a24453a1624', '2025-03-10 13:40:51.37357+00', '2025-03-10 13:40:51.37357+00', 'password', 'fc1480b6-2f58-4ba8-99c0-43225a4ff7c5'),
	('c0cd350d-bb03-4d84-ab51-98bbe7ef33d2', '2025-03-10 13:40:51.74756+00', '2025-03-10 13:40:51.74756+00', 'password', 'a5861114-8940-4564-a6b2-37d96445b6fe'),
	('8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1', '2025-03-10 13:40:52.053819+00', '2025-03-10 13:40:52.053819+00', 'password', '6c541678-1506-4e34-8178-f20be2d1e12d');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'wKvtpZMPbPbDywj8heJMQw', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:39:43.643545+00', '2025-03-10 13:39:43.643545+00', NULL, 'c7402ee1-6110-4a8b-b06e-88804e50d56c'),
	('00000000-0000-0000-0000-000000000000', 2, '9B1nnIjcUwgpkAOD4ZuSGg', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:40:17.278162+00', '2025-03-10 13:40:17.278162+00', NULL, '73268ad2-1e32-4546-8053-b0e2c88faf54'),
	('00000000-0000-0000-0000-000000000000', 3, 'o2i4Y851_O67BXKN0XdkpQ', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:40:47.46836+00', '2025-03-10 13:40:47.46836+00', NULL, '0c85ad27-79ec-49e3-a82f-e6e3457ba5fc'),
	('00000000-0000-0000-0000-000000000000', 4, 'QpH2I3mK8teHPOqMyiJJQw', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:40:50.403142+00', '2025-03-10 13:40:50.403142+00', NULL, 'b2c3c472-8c58-4f5e-9cf1-67b52bf03e76'),
	('00000000-0000-0000-0000-000000000000', 5, 'usy6To2pfn15ZA8ZNP_92w', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:40:51.372729+00', '2025-03-10 13:40:51.372729+00', NULL, 'bb5c6807-795e-47b0-ae4e-2a24453a1624'),
	('00000000-0000-0000-0000-000000000000', 6, 'D5eP1i1mtDxLgKAjUD63Fw', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 13:40:51.746914+00', '2025-03-10 13:40:51.746914+00', NULL, 'c0cd350d-bb03-4d84-ab51-98bbe7ef33d2'),
	('00000000-0000-0000-0000-000000000000', 7, 'Rtxh7LTRf7x2Sr-djdhDbA', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 13:40:52.05312+00', '2025-03-10 14:43:36.598736+00', NULL, '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 8, 'gt4c0Jj3mSMsmVgoQWDj-A', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 14:43:36.609878+00', '2025-03-10 15:43:49.372916+00', 'Rtxh7LTRf7x2Sr-djdhDbA', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 9, '_h3tktrpvTX832tcUphHbA', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 15:43:49.394737+00', '2025-03-10 16:44:01.587246+00', 'gt4c0Jj3mSMsmVgoQWDj-A', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 10, 'qZjPxGtoIC-vrPjqaNqjig', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 16:44:01.592465+00', '2025-03-10 17:44:13.559603+00', '_h3tktrpvTX832tcUphHbA', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 11, 'yjN0vpwpDeLgXl3dHFLzjQ', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 17:44:13.560148+00', '2025-03-10 18:44:25.601146+00', 'qZjPxGtoIC-vrPjqaNqjig', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 12, 'zV1fkRSlxm6sc4XoC2d8wA', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 18:44:25.602719+00', '2025-03-10 19:44:37.595459+00', 'yjN0vpwpDeLgXl3dHFLzjQ', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 13, 'Od_SOWWg8Nh2zJlv28UDWA', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 19:44:37.596019+00', '2025-03-10 20:44:49.566162+00', 'zV1fkRSlxm6sc4XoC2d8wA', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 14, 'h9IAQ03HeVfmLHDQNqJ_vg', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 20:44:49.566955+00', '2025-03-10 21:45:01.639445+00', 'Od_SOWWg8Nh2zJlv28UDWA', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 15, 'dbB1OQl-oZbNqInR5jDA2A', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 21:45:01.639896+00', '2025-03-10 22:45:13.668245+00', 'h9IAQ03HeVfmLHDQNqJ_vg', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 16, 'IIYtEK1J80egeAZoN55ucw', '01511b97-44b3-4aee-a4dd-fe0377c0f476', true, '2025-03-10 22:45:13.668939+00', '2025-03-10 23:45:25.616682+00', 'dbB1OQl-oZbNqInR5jDA2A', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1'),
	('00000000-0000-0000-0000-000000000000', 17, 'YkOlfDpsieIk2a5rfrFNPQ', '01511b97-44b3-4aee-a4dd-fe0377c0f476', false, '2025-03-10 23:45:25.617312+00', '2025-03-10 23:45:25.617312+00', 'IIYtEK1J80egeAZoN55ucw', '8c7bf68f-0f4c-4e92-8abf-9b01f1b3f0f1');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website") VALUES
	('01511b97-44b3-4aee-a4dd-fe0377c0f476', '2025-03-10 13:39:43.604914+00', NULL, NULL, NULL, NULL),
	('00caa582-fe48-40c0-9b0c-d0e1701bb423', '2025-03-12 01:37:29.602894+00', NULL, NULL, NULL, NULL);


--
-- Data for Name: timezone_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."timezone_configs" ("id", "user_id", "name", "description", "timezones", "blocked_hours", "is_public", "created_at", "updated_at") VALUES
	('96bfaad6-ad38-4d16-b691-2efe04b970f5', '00caa582-fe48-40c0-9b0c-d0e1701bb423', 'Last Used Configuration', NULL, '{Europe/London,Asia/Hong_Kong}', '17-6,12-14', false, '2025-03-12 01:49:49.05795+00', '2025-03-12 01:49:49.05795+00');


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_preferences" ("user_id", "default_view", "default_blocked_hours", "recent_timezones", "updated_at") VALUES
	('01511b97-44b3-4aee-a4dd-fe0377c0f476', 'cards', '22-6', NULL, '2025-03-10 13:39:43.604914+00'),
	('00caa582-fe48-40c0-9b0c-d0e1701bb423', 'cards', '22-6', NULL, '2025-03-12 01:37:29.602894+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 21, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
