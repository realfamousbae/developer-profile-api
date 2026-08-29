-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CockroachDB 26.2 locks newly created tables by default. Prisma adds
-- indexes and foreign keys after CREATE TABLE, so keep tables mutable for
-- the duration of this migration.
SET create_table_with_schema_locked = false;

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "slug" STRING NOT NULL,
    "name" STRING NOT NULL,
    "headline" STRING NOT NULL,
    "description" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalLink" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "label" STRING NOT NULL,
    "url" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "ProfessionalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "name" STRING NOT NULL,
    "category" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "company" STRING NOT NULL,
    "position" STRING NOT NULL,
    "startPeriod" STRING NOT NULL,
    "endPeriod" STRING,
    "isCurrent" BOOL NOT NULL DEFAULT false,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" UUID NOT NULL,
    "experienceId" UUID NOT NULL,
    "text" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,
    "url" STRING NOT NULL,
    "repositoryUrl" STRING,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" STRING NOT NULL,
    "sortOrder" INT4 NOT NULL,

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalLink_profileId_label_key" ON "ProfessionalLink"("profileId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalLink_profileId_sortOrder_key" ON "ProfessionalLink"("profileId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_sortOrder_key" ON "Skill"("profileId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_profileId_sortOrder_key" ON "Experience"("profileId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_experienceId_sortOrder_key" ON "Achievement"("experienceId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Project_profileId_name_key" ON "Project"("profileId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_profileId_sortOrder_key" ON "Project"("profileId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTechnology_projectId_name_key" ON "ProjectTechnology"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTechnology_projectId_sortOrder_key" ON "ProjectTechnology"("projectId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ProfessionalLink" ADD CONSTRAINT "ProfessionalLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
