-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('tendik', 'pimpinan');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('diajukan', 'diverifikasi_tendik', 'menunggu_pimpinan', 'siap_diunduh', 'ditolak');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "nip" VARCHAR(32),
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "nim" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "study_program" VARCHAR(120) NOT NULL,
    "degree" VARCHAR(10) NOT NULL DEFAULT 'S1',
    "phone" VARCHAR(25),
    "email" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_types" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ticket_prefix" VARCHAR(32) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "letter_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_requests" (
    "id" UUID NOT NULL,
    "ticket_number" VARCHAR(64) NOT NULL,
    "student_id" UUID NOT NULL,
    "letter_type_id" UUID NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'diajukan',
    "status_label" VARCHAR(64) NOT NULL,
    "semester" VARCHAR(32) NOT NULL,
    "academic_year" VARCHAR(16) NOT NULL,
    "purpose" TEXT NOT NULL,
    "extra_data" JSONB NOT NULL DEFAULT '{}',
    "letter_number" VARCHAR(64),
    "letter_date" DATE,
    "verified_by_id" UUID,
    "signed_by_id" UUID,
    "signed_position" VARCHAR(255),
    "admin_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_status_histories" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "from_status" "RequestStatus",
    "to_status" "RequestStatus" NOT NULL,
    "actor_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_status_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT,
    "file_size" BIGINT,
    "mime_type" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "file_url" TEXT,
    "data_url" TEXT,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER,
    "width_percent" INTEGER NOT NULL DEFAULT 55,
    "offset_x_percent" INTEGER NOT NULL DEFAULT 0,
    "offset_y_percent" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "signer_name" VARCHAR(255),
    "signer_nip" VARCHAR(32),
    "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "helpfulness" VARCHAR(64) NOT NULL,
    "feedback" TEXT,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_surveys" (
    "id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "helpfulness" VARCHAR(64) NOT NULL,
    "satisfaction_aspects" TEXT[],
    "feedback" TEXT,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_nim_key" ON "students"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "letter_types_code_key" ON "letter_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "letter_requests_ticket_number_key" ON "letter_requests"("ticket_number");

-- CreateIndex
CREATE INDEX "letter_requests_status_idx" ON "letter_requests"("status");

-- CreateIndex
CREATE INDEX "letter_requests_student_id_idx" ON "letter_requests"("student_id");

-- CreateIndex
CREATE INDEX "letter_requests_created_at_idx" ON "letter_requests"("created_at" DESC);

-- CreateIndex
CREATE INDEX "letter_status_histories_request_id_created_at_idx" ON "letter_status_histories"("request_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "surveys_request_id_key" ON "surveys"("request_id");

-- AddForeignKey
ALTER TABLE "letter_requests" ADD CONSTRAINT "letter_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_requests" ADD CONSTRAINT "letter_requests_letter_type_id_fkey" FOREIGN KEY ("letter_type_id") REFERENCES "letter_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_requests" ADD CONSTRAINT "letter_requests_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_requests" ADD CONSTRAINT "letter_requests_signed_by_id_fkey" FOREIGN KEY ("signed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_status_histories" ADD CONSTRAINT "letter_status_histories_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "letter_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_status_histories" ADD CONSTRAINT "letter_status_histories_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "letter_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "letter_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
