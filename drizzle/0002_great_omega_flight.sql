CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderName` varchar(140) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`subject` varchar(220) NOT NULL,
	`body` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
