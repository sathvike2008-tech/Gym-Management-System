const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
    res.send("Gym Management System API is running");
});


// ======================================================
// MEMBERS
// ======================================================

// GET all members
app.get("/api/members", (req, res) => {
    const sql = "SELECT * FROM members ORDER BY member_id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch members"
            });
        }

        res.json(results);
    });
});


// ADD member
app.post("/api/members", (req, res) => {

    const {
        full_name,
        email,
        phone,
        gender,
        date_of_birth,
        registration_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO members
        (full_name, email, phone, gender, date_of_birth, registration_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            full_name,
            email,
            phone,
            gender,
            date_of_birth,
            registration_date,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add member"
                });
            }

            res.json({
                message: "Member added successfully",
                member_id: result.insertId
            });
        }
    );
});


// ======================================================
// MEMBERSHIP PLANS
// ======================================================

app.get("/api/membership-plans", (req, res) => {

    const sql = "SELECT * FROM membership_plans ORDER BY plan_id";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch membership plans"
            });
        }

        res.json(results);
    });
});


// ======================================================
// TRAINERS
// ======================================================

// GET trainers
app.get("/api/trainers", (req, res) => {

    const sql = `
        SELECT *
        FROM trainers
        ORDER BY trainer_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch trainers"
            });
        }

        res.json(results);
    });
});


// ADD trainer
app.post("/api/trainers", (req, res) => {

    const {
        full_name,
        email,
        phone,
        specialization,
        experience_years
    } = req.body;

    const sql = `
        INSERT INTO trainers
        (full_name, email, phone, specialization, experience_years)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            full_name,
            email,
            phone,
            specialization,
            experience_years
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add trainer"
                });
            }

            res.json({
                message: "Trainer added successfully",
                trainer_id: result.insertId
            });
        }
    );
});


// ======================================================
// MEMBERSHIPS
// ======================================================

// GET memberships
app.get("/api/memberships", (req, res) => {

    const sql = `
        SELECT
            m.membership_id,
            m.member_id,
            mem.full_name AS member_name,
            m.plan_id,
            mp.plan_name,
            mp.duration_months,
            m.start_date,
            m.end_date,
            m.payment_amount,
            m.payment_status
        FROM memberships m
        JOIN members mem
            ON m.member_id = mem.member_id
        JOIN membership_plans mp
            ON m.plan_id = mp.plan_id
        ORDER BY m.membership_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch memberships"
            });
        }

        res.json(results);
    });
});


// ADD membership
app.post("/api/memberships", (req, res) => {

    const {
        member_id,
        plan_id,
        start_date,
        end_date,
        payment_amount,
        payment_status
    } = req.body;

    const sql = `
        INSERT INTO memberships
        (member_id, plan_id, start_date, end_date, payment_amount, payment_status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            member_id,
            plan_id,
            start_date,
            end_date,
            payment_amount,
            payment_status
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add membership"
                });
            }

            res.json({
                message: "Membership added successfully",
                membership_id: result.insertId
            });
        }
    );
});


// ======================================================
// FITNESS SESSIONS
// ======================================================

// GET fitness sessions
app.get("/api/fitness-sessions", (req, res) => {

    const sql = `
        SELECT
            fs.session_id,
            fs.session_name,
            fs.trainer_id,
            t.full_name AS trainer_name,
            fs.session_date,
            fs.start_time,
            fs.end_time,
            fs.capacity
        FROM fitness_sessions fs
        JOIN trainers t
            ON fs.trainer_id = t.trainer_id
        ORDER BY fs.session_date DESC, fs.start_time
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch fitness sessions"
            });
        }

        res.json(results);
    });
});


// ADD fitness session
app.post("/api/fitness-sessions", (req, res) => {

    const {
        session_name,
        trainer_id,
        session_date,
        start_time,
        end_time,
        capacity
    } = req.body;

    const sql = `
        INSERT INTO fitness_sessions
        (session_name, trainer_id, session_date, start_time, end_time, capacity)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            session_name,
            trainer_id,
            session_date,
            start_time,
            end_time,
            capacity
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add fitness session"
                });
            }

            res.json({
                message: "Fitness session added successfully",
                session_id: result.insertId
            });
        }
    );
});


// ======================================================
// BOOKINGS
// ======================================================

// GET bookings
app.get("/api/bookings", (req, res) => {

    const sql = `
        SELECT
            sb.booking_id,
            sb.member_id,
            mem.full_name AS member_name,
            sb.session_id,
            fs.session_name,
            t.full_name AS trainer_name,
            fs.session_date,
            fs.start_time,
            fs.end_time,
            sb.booking_date,
            sb.booking_status
        FROM session_bookings sb
        JOIN members mem
            ON sb.member_id = mem.member_id
        JOIN fitness_sessions fs
            ON sb.session_id = fs.session_id
        JOIN trainers t
            ON fs.trainer_id = t.trainer_id
        ORDER BY sb.booking_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch bookings"
            });
        }

        res.json(results);
    });
});


// ADD booking
app.post("/api/bookings", (req, res) => {

    const {
        member_id,
        session_id,
        booking_date,
        booking_status
    } = req.body;

    const sql = `
        INSERT INTO session_bookings
        (member_id, session_id, booking_date, booking_status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            member_id,
            session_id,
            booking_date,
            booking_status
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add booking"
                });
            }

            res.json({
                message: "Booking added successfully",
                booking_id: result.insertId
            });
        }
    );
});


// ======================================================
// ATTENDANCE
// ======================================================

// GET attendance
app.get("/api/attendance", (req, res) => {

    const sql = `
        SELECT
            a.attendance_id,
            a.booking_id,
            mem.full_name AS member_name,
            fs.session_name,
            fs.session_date,
            a.attendance_date,
            a.status
        FROM attendance a
        JOIN session_bookings sb
            ON a.booking_id = sb.booking_id
        JOIN members mem
            ON sb.member_id = mem.member_id
        JOIN fitness_sessions fs
            ON sb.session_id = fs.session_id
        ORDER BY a.attendance_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to fetch attendance"
            });
        }

        res.json(results);
    });
});


// ADD attendance
app.post("/api/attendance", (req, res) => {

    const {
        booking_id,
        attendance_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO attendance
        (booking_id, attendance_date, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            booking_id,
            attendance_date,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to add attendance"
                });
            }

            res.json({
                message: "Attendance added successfully",
                attendance_id: result.insertId
            });
        }
    );
});


// ======================================================
// START SERVER
// ======================================================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});