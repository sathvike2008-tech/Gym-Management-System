const API_URL = "http://localhost:3000";


// ======================================================
// GLOBAL DATA
// ======================================================

let membersData = [];
let trainersData = [];
let sessionsData = [];
let bookingsData = [];


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    setupModals();
    setupForms();
    setupSearch();

    setDefaultDates();

    loadDashboard();

    loadMembers();
    loadMemberships();

    loadTrainers();
    loadSessions();
    loadBookings();
    loadAttendance();

});


// ======================================================
// NAVIGATION
// ======================================================

function setupNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

            const sectionId = item.dataset.section;

            document.querySelectorAll(".content-section")
                .forEach(section => {
                    section.classList.remove("active");
                });

            document.getElementById(sectionId)
                .classList.add("active");

        });

    });

}


// ======================================================
// MODALS
// ======================================================

function setupModals() {

    document.querySelectorAll("[data-close]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const modalId = button.dataset.close;

                closeModal(modalId);

            });

        });


    document
        .getElementById("openMemberModal")
        .addEventListener("click", () => {

            openModal("memberModal");

        });


    document
        .getElementById("openMembershipModal")
        .addEventListener("click", async () => {

            await loadMembersForDropdown();
            await loadPlansForDropdown();

            openModal("membershipModal");

        });


    document
        .getElementById("openTrainerModal")
        .addEventListener("click", () => {

            openModal("trainerModal");

        });


    document
        .getElementById("openSessionModal")
        .addEventListener("click", async () => {

            await loadTrainersForDropdown();

            openModal("sessionModal");

        });


    document
        .getElementById("openBookingModal")
        .addEventListener("click", async () => {

            await loadMembersForDropdown();
            await loadSessionsForDropdown();

            openModal("bookingModal");

        });


    document
        .getElementById("openAttendanceModal")
        .addEventListener("click", async () => {

            await loadBookingsForDropdown();

            openModal("attendanceModal");

        });


    // Close modal when clicking outside
    document.querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener("click", event => {

                if (event.target === modal) {
                    modal.classList.remove("show");
                }

            });

        });

}


function openModal(id) {

    document.getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");

}


// ======================================================
// DEFAULT DATES
// ======================================================

function setDefaultDates() {

    const today = new Date()
        .toISOString()
        .split("T")[0];


    const registrationDate =
        document.getElementById("memberRegistrationDate");

    if (registrationDate) {
        registrationDate.value = today;
    }


    const bookingDate =
        document.getElementById("bookingDate");

    if (bookingDate) {
        bookingDate.value = today;
    }


    const attendanceDate =
        document.getElementById("attendanceDate");

    if (attendanceDate) {
        attendanceDate.value = today;
    }


    const membershipStart =
        document.getElementById("membershipStartDate");

    if (membershipStart) {
        membershipStart.value = today;
    }

}


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const [
            members,
            memberships,
            trainers,
            sessions
        ] = await Promise.all([

            fetch(`${API_URL}/api/members`)
                .then(res => res.json()),

            fetch(`${API_URL}/api/memberships`)
                .then(res => res.json()),

            fetch(`${API_URL}/api/trainers`)
                .then(res => res.json()),

            fetch(`${API_URL}/api/fitness-sessions`)
                .then(res => res.json())

        ]);


        document.getElementById("totalMembers")
            .textContent = members.length;


        document.getElementById("totalTrainers")
            .textContent = trainers.length;


        document.getElementById("totalSessions")
            .textContent = sessions.length;


        const today = new Date()
            .toISOString()
            .split("T")[0];


        const activeMemberships = memberships.filter(m => {

            return m.end_date >= today;

        });


        document.getElementById("activeMemberships")
            .textContent = activeMemberships.length;


        displayDashboardSessions(sessions);

        displayDashboardMembers(members);

    } catch (error) {

        console.error("Dashboard error:", error);

    }

}


// ======================================================
// DASHBOARD SESSIONS
// ======================================================

function displayDashboardSessions(sessions) {

    const container =
        document.getElementById("sessionsContainer");


    if (!sessions.length) {

        container.innerHTML =
            `<p class="empty-message">
                No fitness sessions available.
            </p>`;

        return;

    }


    const latestSessions = sessions.slice(0, 5);


    container.innerHTML = latestSessions.map(session => `

        <div class="dashboard-list-item">

            <h4>
                ${escapeHTML(session.session_name)}
            </h4>

            <p>
                Trainer:
                ${escapeHTML(session.trainer_name || "N/A")}
            </p>

            <p>
                ${formatDate(session.session_date)}
                •
                ${formatTime(session.start_time)}
                -
                ${formatTime(session.end_time)}
            </p>

        </div>

    `).join("");

}


// ======================================================
// DASHBOARD MEMBERS
// ======================================================

function displayDashboardMembers(members) {

    const container =
        document.getElementById("membersContainer");


    if (!members.length) {

        container.innerHTML =
            `<p class="empty-message">
                No members available.
            </p>`;

        return;

    }


    const latestMembers = members.slice(0, 5);


    container.innerHTML = latestMembers.map(member => `

        <div class="dashboard-list-item">

            <h4>
                ${escapeHTML(member.full_name)}
            </h4>

            <p>
                ${escapeHTML(member.email || "No email")}
            </p>

            <p>
                Status:
                ${createStatusBadge(member.status)}
            </p>

        </div>

    `).join("");

}


// ======================================================
// MEMBERS
// ======================================================

async function loadMembers() {

    try {

        const response =
            await fetch(`${API_URL}/api/members`);

        membersData = await response.json();

        displayMembers(membersData);

    } catch (error) {

        console.error("Members error:", error);

    }

}


function displayMembers(members) {

    const tbody =
        document.getElementById("membersTableBody");


    if (!members.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No members found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = members.map(member => `

        <tr>

            <td>${member.member_id}</td>

            <td>
                ${escapeHTML(member.full_name)}
            </td>

            <td>
                ${escapeHTML(member.email || "-")}
            </td>

            <td>
                ${escapeHTML(member.phone || "-")}
            </td>

            <td>
                ${escapeHTML(member.gender || "-")}
            </td>

            <td>
                ${formatDate(member.registration_date)}
            </td>

            <td>
                ${createStatusBadge(member.status)}
            </td>

        </tr>

    `).join("");

}


// ======================================================
// MEMBER SEARCH
// ======================================================

function setupSearch() {

    const search =
        document.getElementById("memberSearch");


    search.addEventListener("input", () => {

        const value =
            search.value.toLowerCase().trim();


        const filtered =
            membersData.filter(member => {

                return (
                    (member.full_name || "")
                        .toLowerCase()
                        .includes(value)
                    ||

                    (member.email || "")
                        .toLowerCase()
                        .includes(value)
                    ||

                    (member.phone || "")
                        .toLowerCase()
                        .includes(value)
                );

            });


        displayMembers(filtered);

    });

}


// ======================================================
// ADD MEMBER
// ======================================================

function setupForms() {

    document
        .getElementById("memberForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                full_name:
                    document.getElementById("memberName").value,

                email:
                    document.getElementById("memberEmail").value,

                phone:
                    document.getElementById("memberPhone").value,

                gender:
                    document.getElementById("memberGender").value,

                date_of_birth:
                    document.getElementById("memberDOB").value || null,

                registration_date:
                    document.getElementById("memberRegistrationDate").value,

                status:
                    document.getElementById("memberStatus").value

            };


            await submitForm(
                "/api/members",
                data,
                "Member added successfully"
            );


            document.getElementById("memberForm").reset();

            setDefaultDates();

            closeModal("memberModal");

            await loadMembers();
            await loadDashboard();

        });


    // ==================================================
    // ADD MEMBERSHIP
    // ==================================================

    document
        .getElementById("membershipForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                member_id:
                    document.getElementById("membershipMember").value,

                plan_id:
                    document.getElementById("membershipPlan").value,

                start_date:
                    document.getElementById("membershipStartDate").value,

                end_date:
                    document.getElementById("membershipEndDate").value,

                payment_amount:
                    document.getElementById("membershipAmount").value,

                payment_status:
                    document.getElementById("membershipPaymentStatus").value

            };


            const success = await submitForm(
                "/api/memberships",
                data,
                "Membership added successfully"
            );


            if (success) {

                document
                    .getElementById("membershipForm")
                    .reset();

                closeModal("membershipModal");

                await loadMemberships();
                await loadDashboard();

            }

        });


    // ==================================================
    // ADD TRAINER
    // ==================================================

    document
        .getElementById("trainerForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                full_name:
                    document.getElementById("trainerName").value,

                email:
                    document.getElementById("trainerEmail").value,

                phone:
                    document.getElementById("trainerPhone").value,

                specialization:
                    document.getElementById("trainerSpecialization").value,

                experience_years:
                    document.getElementById("trainerExperience").value

            };


            const success = await submitForm(
                "/api/trainers",
                data,
                "Trainer added successfully"
            );


            if (success) {

                document
                    .getElementById("trainerForm")
                    .reset();

                closeModal("trainerModal");

                await loadTrainers();
                await loadDashboard();

            }

        });


    // ==================================================
    // ADD FITNESS SESSION
    // ==================================================

    document
        .getElementById("sessionForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                session_name:
                    document.getElementById("sessionName").value,

                trainer_id:
                    document.getElementById("sessionTrainer").value,

                session_date:
                    document.getElementById("sessionDate").value,

                start_time:
                    document.getElementById("sessionStartTime").value,

                end_time:
                    document.getElementById("sessionEndTime").value,

                capacity:
                    document.getElementById("sessionCapacity").value

            };


            const success = await submitForm(
                "/api/fitness-sessions",
                data,
                "Fitness session added successfully"
            );


            if (success) {

                document
                    .getElementById("sessionForm")
                    .reset();

                closeModal("sessionModal");

                await loadSessions();
                await loadDashboard();

            }

        });


    // ==================================================
    // ADD BOOKING
    // ==================================================

    document
        .getElementById("bookingForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                member_id:
                    document.getElementById("bookingMember").value,

                session_id:
                    document.getElementById("bookingSession").value,

                booking_date:
                    document.getElementById("bookingDate").value,

                booking_status:
                    document.getElementById("bookingStatus").value

            };


            const success = await submitForm(
                "/api/bookings",
                data,
                "Booking added successfully"
            );


            if (success) {

                document
                    .getElementById("bookingForm")
                    .reset();

                setDefaultDates();

                closeModal("bookingModal");

                await loadBookings();

            }

        });


    // ==================================================
    // ADD ATTENDANCE
    // ==================================================

    document
        .getElementById("attendanceForm")
        .addEventListener("submit", async event => {

            event.preventDefault();


            const data = {

                booking_id:
                    document.getElementById("attendanceBooking").value,

                attendance_date:
                    document.getElementById("attendanceDate").value,

                status:
                    document.getElementById("attendanceStatus").value

            };


            const success = await submitForm(
                "/api/attendance",
                data,
                "Attendance marked successfully"
            );


            if (success) {

                document
                    .getElementById("attendanceForm")
                    .reset();

                setDefaultDates();

                closeModal("attendanceModal");

                await loadAttendance();

            }

        });

}


// ======================================================
// MEMBERSHIPS
// ======================================================

async function loadMemberships() {

    try {

        const response =
            await fetch(`${API_URL}/api/memberships`);

        const memberships =
            await response.json();


        const tbody =
            document.getElementById("membershipsTableBody");


        if (!memberships.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-message">
                        No memberships found.
                    </td>
                </tr>
            `;

            return;

        }


        tbody.innerHTML = memberships.map(membership => `

            <tr>

                <td>${membership.membership_id}</td>

                <td>
                    ${escapeHTML(membership.member_name)}
                </td>

                <td>
                    ${escapeHTML(membership.plan_name)}
                </td>

                <td>
                    ${membership.duration_months} month(s)
                </td>

                <td>
                    ${formatDate(membership.start_date)}
                </td>

                <td>
                    ${formatDate(membership.end_date)}
                </td>

                <td>
                    ₹${Number(membership.payment_amount || 0).toFixed(2)}
                </td>

                <td>
                    ${createStatusBadge(membership.payment_status)}
                </td>

            </tr>

        `).join("");

    } catch (error) {

        console.error("Memberships error:", error);

    }

}


// ======================================================
// MEMBERSHIP DROPDOWN
// ======================================================

async function loadMembersForDropdown() {

    const select =
        document.getElementById("membershipMember");


    const bookingSelect =
        document.getElementById("bookingMember");


    try {

        const response =
            await fetch(`${API_URL}/api/members`);

        const members =
            await response.json();


        const options = `
            <option value="">Select Member</option>
            ${
                members.map(member => `
                    <option value="${member.member_id}">
                        ${escapeHTML(member.full_name)}
                    </option>
                `).join("")
            }
        `;


        select.innerHTML = options;

        bookingSelect.innerHTML = options;

    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// MEMBERSHIP PLAN DROPDOWN
// ======================================================

async function loadPlansForDropdown() {

    const select =
        document.getElementById("membershipPlan");


    try {

        const response =
            await fetch(`${API_URL}/api/membership-plans`);

        const plans =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Plan
            </option>

            ${
                plans.map(plan => `
                    <option
                        value="${plan.plan_id}"
                        data-price="${plan.price}"
                    >
                        ${escapeHTML(plan.plan_name)}
                        - ₹${plan.price}
                    </option>
                `).join("")
            }
        `;


        select.onchange = () => {

            const selected =
                select.options[select.selectedIndex];

            const price =
                selected.dataset.price;


            if (price) {

                document
                    .getElementById("membershipAmount")
                    .value = price;

            }

        };

    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// TRAINERS
// ======================================================

async function loadTrainers() {

    try {

        const response =
            await fetch(`${API_URL}/api/trainers`);

        trainersData =
            await response.json();


        displayTrainers(trainersData);

    } catch (error) {

        console.error("Trainers error:", error);

    }

}


function displayTrainers(trainers) {

    const tbody =
        document.getElementById("trainersTableBody");


    if (!trainers.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No trainers found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = trainers.map(trainer => `

        <tr>

            <td>${trainer.trainer_id}</td>

            <td>
                ${escapeHTML(trainer.full_name)}
            </td>

            <td>
                ${escapeHTML(trainer.email || "-")}
            </td>

            <td>
                ${escapeHTML(trainer.phone || "-")}
            </td>

            <td>
                ${escapeHTML(trainer.specialization || "-")}
            </td>

            <td>
                ${trainer.experience_years || 0} years
            </td>

        </tr>

    `).join("");

}


// ======================================================
// TRAINER DROPDOWN
// ======================================================

async function loadTrainersForDropdown() {

    const select =
        document.getElementById("sessionTrainer");


    try {

        const response =
            await fetch(`${API_URL}/api/trainers`);

        const trainers =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Trainer
            </option>

            ${
                trainers.map(trainer => `
                    <option value="${trainer.trainer_id}">
                        ${escapeHTML(trainer.full_name)}
                    </option>
                `).join("")
            }
        `;

    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// FITNESS SESSIONS
// ======================================================

async function loadSessions() {

    try {

        const response =
            await fetch(`${API_URL}/api/fitness-sessions`);

        sessionsData =
            await response.json();


        displaySessions(sessionsData);

    } catch (error) {

        console.error("Sessions error:", error);

    }

}


function displaySessions(sessions) {

    const tbody =
        document.getElementById("sessionsTableBody");


    if (!sessions.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No fitness sessions found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = sessions.map(session => `

        <tr>

            <td>
                ${session.session_id}
            </td>

            <td>
                ${escapeHTML(session.session_name)}
            </td>

            <td>
                ${escapeHTML(session.trainer_name || "-")}
            </td>

            <td>
                ${formatDate(session.session_date)}
            </td>

            <td>
                ${formatTime(session.start_time)}
            </td>

            <td>
                ${formatTime(session.end_time)}
            </td>

            <td>
                ${session.capacity}
            </td>

        </tr>

    `).join("");

}


// ======================================================
// SESSION DROPDOWN
// ======================================================

async function loadSessionsForDropdown() {

    const select =
        document.getElementById("bookingSession");


    try {

        const response =
            await fetch(`${API_URL}/api/fitness-sessions`);

        const sessions =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Session
            </option>

            ${
                sessions.map(session => `
                    <option value="${session.session_id}">
                        ${escapeHTML(session.session_name)}
                        -
                        ${formatDate(session.session_date)}
                        -
                        ${formatTime(session.start_time)}
                    </option>
                `).join("")
            }
        `;

    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// BOOKINGS
// ======================================================

async function loadBookings() {

    try {

        const response =
            await fetch(`${API_URL}/api/bookings`);

        bookingsData =
            await response.json();


        displayBookings(bookingsData);

    } catch (error) {

        console.error("Bookings error:", error);

    }

}


function displayBookings(bookings) {

    const tbody =
        document.getElementById("bookingsTableBody");


    if (!bookings.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No bookings found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = bookings.map(booking => `

        <tr>

            <td>
                ${booking.booking_id}
            </td>

            <td>
                ${escapeHTML(booking.member_name)}
            </td>

            <td>
                ${escapeHTML(booking.session_name)}
            </td>

            <td>
                ${escapeHTML(booking.trainer_name || "-")}
            </td>

            <td>
                ${formatDate(booking.session_date)}
            </td>

            <td>
                ${formatTime(booking.start_time)}
                -
                ${formatTime(booking.end_time)}
            </td>

            <td>
                ${formatDate(booking.booking_date)}
            </td>

            <td>
                ${createStatusBadge(booking.booking_status)}
            </td>

        </tr>

    `).join("");

}


// ======================================================
// BOOKING DROPDOWN
// ======================================================

async function loadBookingsForDropdown() {

    const select =
        document.getElementById("attendanceBooking");


    try {

        const response =
            await fetch(`${API_URL}/api/bookings`);

        const bookings =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Booking
            </option>

            ${
                bookings.map(booking => `
                    <option value="${booking.booking_id}">
                        #${booking.booking_id}
                        -
                        ${escapeHTML(booking.member_name)}
                        -
                        ${escapeHTML(booking.session_name)}
                        -
                        ${formatDate(booking.session_date)}
                    </option>
                `).join("")
            }
        `;

    } catch (error) {

        console.error(error);

    }

}


// ======================================================
// ATTENDANCE
// ======================================================

async function loadAttendance() {

    try {

        const response =
            await fetch(`${API_URL}/api/attendance`);

        const attendance =
            await response.json();


        displayAttendance(attendance);

    } catch (error) {

        console.error("Attendance error:", error);

    }

}


function displayAttendance(attendance) {

    const tbody =
        document.getElementById("attendanceTableBody");


    if (!attendance.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No attendance records found.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = attendance.map(record => `

        <tr>

            <td>
                ${record.attendance_id}
            </td>

            <td>
                #${record.booking_id}
            </td>

            <td>
                ${escapeHTML(record.member_name)}
            </td>

            <td>
                ${escapeHTML(record.session_name)}
            </td>

            <td>
                ${formatDate(record.session_date)}
            </td>

            <td>
                ${formatDate(record.attendance_date)}
            </td>

            <td>
                ${createStatusBadge(record.status)}
            </td>

        </tr>

    `).join("");

}


// ======================================================
// GENERIC FORM SUBMISSION
// ======================================================

async function submitForm(endpoint, data, successMessage) {

    try {

        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.error || "Request failed"
            );

        }


        alert(successMessage);

        return true;

    } catch (error) {

        console.error(error);

        alert(
            "Error: " + error.message
        );

        return false;

    }

}


// ======================================================
// STATUS BADGE
// ======================================================

function createStatusBadge(status) {

    if (!status) {
        return "-";
    }


    const normalized =
        String(status)
            .toLowerCase()
            .replace(/\s+/g, "-");


    return `
        <span class="status-badge status-${normalized}">
            ${escapeHTML(status)}
        </span>
    `;

}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const d = new Date(date);


    if (isNaN(d.getTime())) {
        return date;
    }


    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// ======================================================
// TIME FORMAT
// ======================================================

function formatTime(time) {

    if (!time) {
        return "-";
    }


    const parts =
        String(time).split(":");


    if (parts.length < 2) {
        return time;
    }


    let hours =
        parseInt(parts[0]);


    const minutes =
        parts[1];


    const period =
        hours >= 12 ? "PM" : "AM";


    hours =
        hours % 12 || 12;


    return `${hours}:${minutes} ${period}`;

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}