## Software Requirements Specification

for

## <Play , learn & protect >

Version 1.0 approved

Prepared by <Hamza essam , fares belal , omar hossam , rawan ehab ,

mohamed emadeldin >

<GIU>

<18/12/2025>


## Table of Contents

## Revision History

| Name | Date | Reason For Changes | Version |
| --- | --- | --- | --- |


## 1. Introduction

## 1.1 Purpose

Defining and describing the functions and specifications of the Play, Learn & Protect (PLP) Platform is the primary goal of this Software Requirements Specification (SRS).

This Software Requirements Specification illustrates, in clear terms, the system’s primary uses and required functionality as specified by our customer.

The intended audience of this document is our primary Play, Learn & Protect project customer: the Course Instructor, the supervising teaching staff, the student development team, and other students enrolled in the course who require access to the system documentation.

## 1.2 Document Conventions

- This Software Requirements Specification (SRS) follows standard academic and IEEE-style documentation conventions..

- Functional requirements are uniquely identified using the format FR-XX (e.g., FR-01, FR-02).

- Section headings and numbering follow a hierarchical structure for clarity and traceability.

- No color-based meaning is used; all emphasis is conveyed through text formatting to ensure accessibility.

## Requirement Priority

- All functional requirements listed in this document are considered mandatory unless explicitly stated otherwise.

- Detailed requirements inherit the priority of their parent system feature.

- No separate priority levels (e.g., high, medium, low) are assigned unless explicitly specified in future revisions.


## 1.3 Intended Audience and Reading Suggestions

The intended audience of this document is our primary Play, Learn & Protect project customer: the Course Instructor, the supervising teaching staff, the student development team, and other students enrolled in the course who require access to the system documentation.

## 1.4 Product Scope

The software system being produced is called the Play, Learn & Protect Platform, or PLP. It is being produced for a customer interested in providing children with culturally relevant educational games, creative learning experiences, and digital safety tools. This system is designed to “provide automation support” for playful learning, curriculum-based education, creativity development, and safety monitoring in a unified digital environment. The system is cross-platform and will be available to children, parents, and educators using standard web browsers or school-provided computing resources. The system will run on a central server, with each user interacting through a remote, child-friendly web interface.

## 1.5 References

Prensky, M. (2001). Digital Game-Based Learning.

McGraw-Hill.

## Kahoot! – Game-Based Quiz Platform

A popular online game-based learning platform where kids take part in interactive quizzes that feel like games

https://kahoot.com/

## 2. Overall Description

## 2.1 Product Perspective

- Play, Learn & Protect is a single software platform designed for children and youth. It integrates three core modules:

- Playful games to foster imagination and social skills.

- Learning experiences aligned with formal curricula.

- Digital safety tools to protect children online.

- The platform is web-based and mobile-accessible, ensuring availability across devices commonly used by children, parents, and educators.

- It must be designed with cultural sensitivity, embedding local language, history, and family structures relevant to Egypt.


- No specialized hardware requirements are expected beyond standard devices (PCs, tablets, smartphones) with internet access.

- The frontend will be developed using low-code/no-code platforms (e.g., Lovable, Cursor), with optional backend and database integration for scalability.

## 2.2 Product Functions

- The platform will provide the following functions:

- Child-friendly dashboard with gamified features (leaderboards, points, achievements, awards).

- Serious games aligned with curricula (physics, chemistry, math, language, coding).

- Creative learning modules where children apply knowledge in imaginative contexts.

- Monitoring module for parents and educators to track: Screen-time patterns.

- Digital behavior (cyberbullying, inappropriate content, excessive gaming).

- Dashboards visualizing time spent, content accessed, and frequency of sessions.

- Threat detection algorithms to identify unsafe behaviors (cyberbullying, explicit content) and generate alerts that teach safe practices.

- Multi-user access for children, parents, and teachers with role-based dashboards.

- Gamified competitions and awards to encourage engagement and motivation.

## 2.3 User Classes and Characteristics

- 3. segmented into three age groups: 3–5, 6–8, and 9–12. These users are expected to interact with the system through a child-friendly interface that uses icons, gamified elements, and simple navigation. Secondary users include parents and educators who will monitor children's digital behavior and learning progress via dedicated dashboards. It is assumed that children have basic familiarity with mobile or web interfaces, while adults are capable of interpreting visual data and alerts. The system must accommodate varying levels of digital literacy, especially among younger children, by simplifying interactions and minimizing cognitive load. In SCR terms, each user group can be modeled as a distinct mode class, with transitions between modes (e.g., child playing, parent monitoring, educator reviewing) triggered by events such as login, session timeout, or role-based access. These transitions will be governed by mode class tables and condition tables that define valid state changes and access permissions. The primary users of the Play, Learn & Protect platform are children aged 3 to 12,


## 3.1 Operating Environment

The system shall operate as a web-based application accessible through any modern web browser. The application is designed to be platform-independent and does not require specialized hardware.

## Hardware Platform:

The system shall run on standard consumer hardware, including desktop computers and laptops. No special hardware components are required beyond a keyboard, mouse or touchpad, display, and audio output where applicable.

## Operating Systems:

The application shall be compatible with all major operating systems that support modern web browsers, including but not limited to:

- Microsoft Windows (Windows 10 or later)

- macOS (latest stable versions)

- Linux distributions with modern browser support

## Web Browsers:

The system shall support the latest stable versions of modern web browsers, including:

- Google Chrome

- Mozilla Firefox

- Microsoft Edge

- Apple Safari

## Network Requirements:

An active internet connection is required for accessing the system, retrieving learning content, synchronizing user progress, and enabling interactive features.

## Software Dependencies and Coexistence:

The application shall operate without interfering with other software running on the client device. It shall peacefully coexist with other web-based applications and browser extensions and shall not require the installation of additional plugins or third-party software.

## 3.2 Design and Implementation Constraints

The Play, Learn & Protect platform must operate securely and responsively across modern browsers and devices, including desktops, tablets, and smartphones. Unlike the BECS system, security is a critical concern here: all user data, especially child profiles and behavioral logs, must


be encrypted and protected against unauthorized access. Passwords must follow strong security policies, and all communication involving sensitive data must occur over secure channels. The system must detect and respond to unsafe digital behaviors such as cyberbullying or exposure to explicit content using real-time algorithms. These detections are modeled as events in SCR, such as ”cyber bullying detected” or “content flagged", which trigger alerts and mode transitions (e.g., from "SafeBrowsing" to "AlertMode"). Controlled variables like screen time,promotion added ,digital behaviour score must be updated based on these events, as shown in event tables and condition tables. The platform must also respect cultural constraints by embedding Egyptian language, history, and family values into its content. Offline functionality is limited, and internet access is required for most features. The system must support at least 10,000 concurrent users without performance degradation, and all mode transitions and controlled variable updates must be validated against SCR-style logic to ensure consistency and correctness.

| Mode Class | Event | Condition | New Mode |
| --- | --- | --- | --- |
| ChildDashboard @T(PlayGame) |   | AgeGroupSelected | GameMode |
| GameMode | @T(CompleteLearningTask) | TaskScore ≥ Threshold | CreativeMode |
| CreativeMode | @T(SubmitProject) | ProjectValid | AwardMode |
|   | ParentDashboard @T(ViewMonitoringDashboard) | ParentLoggedIn | MonitoringMode |
|   | MonitoringMode @T(CyberbullyingDetected) | BehaviorScore < SafeThreshold | AlertMode |

## 3.3 User Documentation

The system will provide minimal, built-in user documentation appropriate for all user groups, including children, teachers, and parents.

## On-Screen Guidance

- The application shall include context-sensitive on-screen tips and guidance messages displayed at each step of user interaction.

- These tips will appear within all major sections of the system and will explain available actions and system behavior in a simple and clear manner.


- The guidance will be designed to be visual and easy to understand, making it suitable for children without requiring external manuals.

## Support for Teachers and Parents

- Teachers and parents who require additional assistance or clarification shall be able to contact the system administrator through a provided contact mechanism (e.g., email or contact form).

- No separate user manuals, tutorials, or downloadable documentation will be provided.

## Documentation Delivery Format

All user guidance shall be delivered within the web application interface.

Documentation will be presented as inline tips, tooltips, and informational messages.

No printed documentation or external files are required.

## 3.4 Assumptions and Dependencies

## Client Assumptions:

It is assumed that children, parents, and educators accessing the platform will have access to functioning devices such as tablets, smartphones, or desktop computers with internet connectivity. Users are expected to be capable of basic interactions such as launching the application, logging in, and navigating through the dashboard using visual icons and simple menus. For children, the interface is designed to be intuitive and age-appropriate, minimizing the need for adult supervision during gameplay and learning sessions.

## Provider Assumptions:

It is assumed that the Play, Learn & Protect platform will be hosted on a reliable web server with a secure backend and database system. The server must support real-time data processing for monitoring modules, game progress tracking, and alert generation. The system depends on consistent internet access to deliver learning content, update dashboards, and detect unsafe digital behavior. Dependencies include third-party libraries for gamification, analytics, and threat detection algorithms, which must be properly integrated and maintained.


## General Assumptions:

- Children will not require access to advanced system settings or account modification features.

- Parent and educator accounts will be role-restricted and cannot be used to play games or access child-only modules.

- All user roles (child, parent, educator) are predefined and cannot be altered by the user.

- The system will not support offline gameplay or monitoring; internet access is mandatory.

- Alerts generated by the system are educational in nature and do not block content unless explicitly configured.

- SCR modeling assumes that each user role corresponds to a distinct mode class, and transitions between modes are triggered by events such as login, task completion, or unsafe behavior detection.

## 4. External Interface Requirements

## 4.1 User Interfaces

- The system shall provide web-based graphical user interfaces tailored to the different user roles: child, parent, teacher, and admin. All user interfaces shall be accessed through a standard web browser.

- 1.1 General UI Characteristics

- The user interface shall be responsive and usable on standard desktop and laptop screens.

- The system shall follow a child-friendly visual style, using clear icons, large buttons, readable fonts, and minimal text for children.

- Consistent layout, color scheme, and navigation patterns shall be maintained across all screens.

- Each screen shall include standard interface elements such as:

- Navigation bar or menu

- Logout button

- Visual feedback for user actions

- On-screen tips and guidance messages


## 1.2 Child User Interface

- The child interface shall include:

- A gamified dashboard displaying points, levels, achievements, and leaderboards.

- Game screens for serious games and creative activities.

- Visual progress indicators and reward animations.

- Interaction shall rely primarily on mouse or touchpad input.

- Context-sensitive tips shall guide the child at each step without requiring external help documentation


## ● 1.3 Error Handling and Messages

- Error messages shall be displayed in a clear and non-technical manner.

- Child-facing errors shall use simple language and icons.

- Parent, teacher, and admin errors may include more descriptive information.


## 4.2 Hardware Interfaces

- The system does not require direct integration with specialized hardware components.

- The software shall operate on standard personal computers and laptops.

- Supported input/output devices include:

- Keyboard

- Mouse or touchpad

- Display screen

- Audio output devices (optional, for game sounds)

- No external sensors, wearable devices, or custom hardware interfaces are required.

- All hardware interaction shall be mediated through the web browser and operating system.

## 4.3 Software Interfaces

## ● Backend and Server Interfaces:

- The system backend shall be implemented using Node.js and Express.js.

- RESTful APIs shall be exposed to handle authentication, games, monitoring, and safety features.

- Data exchange between client and server shall use JSON format over HTTP/HTTPS.

- Database Interface:


- The system shall use MongoDB as the database management system.

- MongoDB shall store user data, game content, sessions, achievements, monitoring records, and safety alerts.

- Database access shall be managed using an Object Data Modeling (ODM) library (e.g., Mongoose).

- Frontend Interface:

- The frontend shall be implemented using React.js.

- The frontend shall communicate with the backend via REST APIs.

- State management shall handle user sessions, game progress, and monitoring data.

- Authentication and Security Interfaces:

- Authentication shall be implemented using JSON Web Tokens (JWT).

- Tokens shall be passed in the HTTP Authorization header using the Bearer scheme.

- Role-based access control shall restrict access to features based on user roles.

- Integrated Software Components:

- Web browser (Chrome, Firefox, Edge, Safari – latest versions)

- Node.js runtime environment

- MongoDB database server

## 4.4 Communications Interfaces

- Network Communication:

- The system shall communicate over the internet using the HTTP/HTTPS protocol.

- All client-server communication shall use RESTful web services.

- Data Formats:

- Requests and responses shall be formatted in JSON.

- Standard HTTP status codes shall be used to indicate success or failure of requests.

- Security and Encryption:

- HTTPS shall be used to encrypt all data transmitted between the client and server.


- Sensitive data such as authentication tokens and user credentials shall not be transmitted in plain text.

- External Communication:

- Communication between parents/teachers and administrators may be performed via:

- Email links or contact forms provided within the application.

- No direct third-party messaging or file transfer protocols (e.g., FTP) are required.

## 5. System Features

Each feature is defined in terms of its purpose, supported user roles, stimulus–response sequences, and detailed functional requirements. The organization by system features was selected to clearly reflect the modular design of the

platform and to align with the core functional requirements


Software Requirements Specification for <Project>

Page 13

- 5.1 Gamified Child Dashboard

- 5.1.1 Description and Priority

The Gamified Child Dashboard provides children with a single, unified entry point to access learning games, view achievements, track progress, and engage with the platform in a safe and motivating manner. Priority: High

This feature is essential for user engagement and fulfills FR-01.

- 5.1.2 Stimulus / Response Sequences

- Child logs into the system

- System authenticates user and identifies role as child

- System loads dashboard with games displayed in a grid format

- Child selects a game and clicks “Play”

- System launches the selected game and tracks progress

- Upon completion, the system updates points and achievements

## 5.1.3 Functional Requirements

- REQ-CD-01: The system shall display all available games on a single dashboard page.

- REQ-CD-02: The system shall present games in a card or grid layout.

- REQ-CD-03: Each game card shall display the game title, category icon, and progress indicator.

- REQ-CD-04: The system shall automatically update points upon game completion.

- REQ-CD-05: The dashboard shall not allow children to modify profile or monitoring settings.

- REQ-CD-06: In case of a loading error, the system shall display a child-friendly error message.

## 5.2 Learning Games Module

- 5.2.1 Description and Priority


This module delivers curriculum-aligned serious games for multiple subjects and age

groups, adapting difficulty based on performance. Priority: High

Supports FR-02.

## 5.2.2 Stimulus / Response Sequences

- Child selects a subject-based game

- System loads age-appropriate content

- Child completes learning tasks

- System evaluates performance and adjusts difficulty

- Progress is saved automatically

## 5.2.3 Functional Requirements

- REQ-LG-01: The system shall provide games aligned with formal curriculum topics.

- REQ-LG-02: The system shall categorize games by age group.

- REQ-LG-03: Difficulty shall increase or decrease based on child performance.

- REQ-LG-04: Some games shall require creative activity completion.

- REQ-LG-05: The system shall save progress automatically after each session.

## 5.3 Creative Sandbox Module

- 5.3.1 Description and Priority

The Creative Sandbox allows children to reinforce learning through creative expression. Priority: Medium

Supports FR-03.

## 5.3.2 Stimulus / Response Sequences

- Child enters creative sandbox

- Child selects activity (drawing, story, puzzle)

- Child completes creative task


- System saves output to child profile

## 5.3.3 Functional Requirements

- REQ-CS-01: The system shall provide drawing and story-building tools.

- REQ-CS-02: The system shall allow digital puzzle and sandbox activities.

- REQ-CS-03: All creative submissions shall be saved to the child’s profile.

- REQ-CS-04: Children shall not be able to share content externally.

## 5.4 Parent / Educator Monitoring Dashboard

- 5.4.1 Description and Priority

This feature enables parents and teachers to monitor child activity, learning progress, and safety events.

Priority: High

Supports FR-04.

## 5.4.2 Stimulus / Response Sequences

- Parent/teacher logs in

- System loads monitoring dashboard

- User selects a child profile

- System displays screen-time, activity logs, and alerts

## 5.4.3 Functional Requirements

- REQ-MD-01: The system shall display screen-time statistics using visual graphs.

- REQ-MD-02: The system shall show accessed content categories.

- REQ-MD-03: The system shall list detected safety events.

- REQ-MD-04: Parents and teachers shall be able to contact the admin for support.

- REQ-MD-05: Downloadable reports shall not be supported in version 1.


## 5.5 Content Safety System

## 5.5.1 Description and Priority

This system detects unsafe behavior and provides educational alerts rather than blocking

content. Priority: High

Supports FR-05.

## 5.5.2 Stimulus / Response Sequences

- Child interacts with content

- System monitors behavior in real time

- Unsafe behavior detected

- System generates alert

- Alert delivered to parent/teacher

## 5.5.3 Functional Requirements

- REQ-SS-01: The system shall detect cyberbullying indicators.

- REQ-SS-02: The system shall detect inappropriate language or content.

- REQ-SS-03: The system shall generate safety alerts.

- REQ-SS-04: Alerts shall be visible only to parents and teachers.

- REQ-SS-05: Alerts shall include educational guidance.

## 6. Other Nonfunctional Requirements

## 6.1 Performance Requirements

- The system shall load dashboard pages within 3 seconds under normal network conditions.

- API responses shall be returned within 2 seconds for standard requests.

- The system shall support concurrent users without degradation of core functionality.


## 6.2 Safety Requirements

- The system shall not expose unsafe content directly to children.

- Safety alerts shall aim to educate rather than punish.

- All detected safety incidents shall be logged for review.

## 6.3 Security Requirements

- User authentication shall use JWT-based authentication.

- Role-based access control shall restrict features per user type.

- Sensitive data shall be transmitted using HTTPS.

- Child profiles shall have restricted access by design.

## 6.4 Software Quality Attributes

- Usability: High priority, especially for children.

- Reliability: System shall maintain consistent behavior.

- Maintainability: Modular MERN architecture.

- Portability: Browser-based, platform independent.

- Scalability: Backend designed to support future feature expansion.

## 7. Other Requirements

- Data shall be stored using MongoDB.

- System shall support multiple languages in future versions.

- The platform must comply with child online safety best practices.

## Appendix A: Glossary

Term

Definition


|   | PLP Play, Learn & Protect Platform |
| --- | --- |
| Age Group (3–5) | The youngest user group; requires simplified interfaces and pre-literacy learning activities |
| Age Group (6–8) | Intermediate users capable of basic reading, simple problem-solving, and core learning games |
| Age Group (9–12) | Advanced users capable of deeper learning, critical thinking, and structured educational tasks |
| Avatar | A character representing the child within games and the platform dashboard |
| Badge | A gamification reward earned by children upon achieving milestones |
| Creativity Module | A feature that enables children to apply learned knowledge in drawing, storytelling, building, or problem-solving activities |
| Dashboard | The user interface that presents personalized information, progress, activities, and alerts |
| Digital Behavior | Patterns of user actions including screen-time, accessed content, and online interactions |


| Educational Game(SeriousGame) | A game with learning objectives in subjects such as math, science, language, and coding |
| --- | --- |
| Gamification | Points, rewards, achievements, levels, competitions, and leaderboards designed to increase engagement |
| User | Any child, parent, or educator who interacts with the PLP platform |
| Learning Path | A structured sequence of activities aligned with a child’s age group and learning curve |
| Monitoring Module | A system component that tracks user behavior, screen-time, and potential safety risks |
| Parent | A registered adult user responsible for overseeing one or more children’s accounts |
| Educator | A teacher or school staff member monitoring learning behavior and progress using analytics dashboards |
| Safety Alert | A notification generated when cyberbullying indicators, explicit content, or excessive gaming are detected |
| Screen-Time | The amount of time a child spends actively using the PLP system |
| Session | The time during which a child is actively interacting with the platform |
| Serious Learning | Formal curricula-based content introducing math, physics, chemistry, language, and coding concepts |
| SRS | Software Requirements Specification |

## Appendix B: Analysis Models

- Sequence Diagram


## Educational Platform - Sequence Diagrams

## ● Use case diagram


*Page 21*

## ● Class diagram


- State diagram


- WRSMP diagram


## Software Requirements Specification for <Project> Page 24

W — Children (ages 6-12), students in school, educational curriculum context

R — Child-friendly dashboard (FR-01) and

serious games (FR-02)

S Dashboard UI, gamification engine, game modules for 5+ Subjects, progress tracking

P — ReactHTML dashboard, g

database, content

M Web browsers, mobile devices, deskiop computers, internet connectivity

R - Requirements

W - World (Environment)

6-12)

Children

(ages in

Students

school curriculum

Educational

Leaming

motivation

+

## S - Specification

design

Dashboard

Gamification

Game modules

engine (5+

Progress

Chil-fiendly

FR.01: (icons, FR.02 (Math,

dashboard

Ul

menus, gamication)

games

Cumculum-aligned

subjects)

Physics,

Chemisty,

etc)

tracking

system

## Appendix C: To Be Determined List

## TBD-01: Future password recovery mechanism

## TBD-02: Advanced analytics enhancements

## TBD-03: External integrations (schools, third-party tools)
