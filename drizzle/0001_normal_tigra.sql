CREATE TABLE `portfolio_content` (
	`id` int NOT NULL,
	`profileJson` text NOT NULL,
	`skillsJson` text NOT NULL,
	`projectsJson` text NOT NULL,
	`educationJson` text NOT NULL,
	`certificationsJson` text NOT NULL,
	`languagesJson` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_content_id` PRIMARY KEY(`id`)
);
