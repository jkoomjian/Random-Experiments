--Rebuild DB with:
--mysql idea_development -u jkoomjian -ppass < db/create.sql

--Create DB with:
--create database idea_repo_development;

--order is important here b/c of foriegn keys!
drop table if exists tags_filters, ideas_tags, filters, tags, attachments, criteria_responses, ideas, criterias, users;

create table users (
	id							int 			auto_increment primary key,
	email						varchar(128)	not null,
	crypted_password			varchar(40)		not null,
	salt						varchar(40)		not null,
	created_at					timestamp		not null,
	updated_at					timestamp		not null,
	remember_token				varchar(40),
	remember_token_expires_at	timestamp,
	INDEX (email)
) ENGINE=InnoDB;

create table criterias (
	id					int 			auto_increment primary key,
	user_id				int,
	title				varchar(256)	not null,
	description			text,
	weight				int,
	active				enum('Y', 'N')	DEFAULT 'Y',
	criteria_order		int,
	created_on			timestamp		not null,
	updated_at			timestamp		not null,
	foreign key (user_id) references users(id)
) ENGINE=InnoDB;

create table ideas (
	id					int 			auto_increment primary key,
	user_id				int,
	title				varchar(256)	not null,
	score				int,
	summary				text,
	additional_thoughts	text,
	created_on			timestamp		not null,
	updated_at			timestamp		not null,
	foreign key (user_id) references users(id)
) ENGINE=InnoDB;

create table criteria_responses (
	id						int 			auto_increment primary key,
	idea_id					int,
	criteria_id	int,
	score					int,
	response				text,
	created_on				timestamp		not null,
	updated_at				timestamp		not null,
	foreign key (idea_id) references ideas(id),
	foreign key (criteria_id) references criterias(id)
) ENGINE=InnoDB;

--TODO there should really be foreign keys from attachments to ideas or criteria_responses
create table attachments (
	id						int 			auto_increment primary key,
	idea_id					int,
	criteria_response_id	int,
	name					varchar(255)	not null,
	data					mediumblob,
	created_on				timestamp		not null,
	updated_at				timestamp		not null
) ENGINE=InnoDB;

create table tags (
	id						int 			auto_increment primary key,
	name					varchar(255)	not null,
	user_id					int,
	created_on				timestamp		not null,
	foreign key (user_id) references users(id),
	INDEX (name)
) ENGINE=InnoDB;

create table filters (
	id						int 			auto_increment primary key,
	name					varchar(255)	not null,
	user_id					int,
	created_on				timestamp		not null,
	foreign key (user_id) references users(id)
) ENGINE=InnoDB;

--Rails automatically figures out join tables, as long as you use the standard naming convention
create table ideas_tags (
	idea_id					int,
	tag_id					int,
	primary key (idea_id, tag_id),
	foreign key (idea_id) references ideas(id),
	foreign key (tag_id) references tags(id)
) ENGINE=InnoDB;

create table tags_filters (
	tag_id					int,
	filter_id				int,
	primary key (tag_id, filter_id),
	foreign key (tag_id) references tags(id),
	foreign key (filter_id) references filters(id)
) ENGINE=InnoDB;