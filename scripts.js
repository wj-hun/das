// Doctor database
const doctors = [
    { id: 1, name: "Dr. Adam Smith", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Maria Gomez", specialty: "Dermatologist" },
    { id: 3, name: "Dr. John Lee", specialty: "Neurologist" },
    { id: 4, name: "Dr. Sarah Khan", specialty: "Dentist" }
];

// Time slot database (per day)
const timeSlots = [
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "11:00 - 11:30",
    "01:00 - 01:30",
    "01:30 - 02:00",
    "03:00 - 03:30"
];

// Load appointments from localStorage
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

// DOM elements
const doctorList = document.getElementById("doctorList");
const doctorSelect = document.getElementById("doctorSelect");
const searchDoctor = document.getElementById("searchDoctor");
const timeSlotSelect = document.getElementById("timeSlot");
const appointmentList = document.getElementById("appointmentList");


// Display doctors
function loadDoctors(filter = "") {
    doctorList.innerHTML = "";
    doctorSelect.innerHTML = "<option value=''>Select a doctor</option>";

    doctors
        .filter(doc =>
            doc.name.toLowerCase().includes(filter.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(doc => {
            doctorList.innerHTML += `
                <div class='doctor-card'>
                    <strong>${doc.name}</strong><br>
                    Specialty: ${doc.specialty}
                </div>
            `;

            doctorSelect.innerHTML += `
                <option value="${doc.id}">
                    ${doc.name} (${doc.specialty})
                </option>
            `;
        });
}

// Load available time slots for selected doctor and date
function loadTimeSlots() {
    const doctorId = doctorSelect.value;
    const date = document.getElementById("appointmentDate").value;
    timeSlotSelect.innerHTML = "<option value=''>Choose a slot</option>";

    if (!doctorId || !date) return;

    const bookedSlots = appointments
        .filter(a => a.doctorId == doctorId && a.date === date)
        .map(a => a.slot);

    timeSlots.forEach(slot => {
        if (!bookedSlots.includes(slot)) {
            timeSlotSelect.innerHTML += `<option value="${slot}">${slot}</option>`;
        }
    });
}


// Display all appointments
function renderAppointments() {
    appointmentList.innerHTML = "";
    if (appointments.length === 0) {
        appointmentList.innerHTML = "<p>No appointments yet.</p>";
        return;
    }

    appointments.forEach(a => {
        const doctor = doctors.find(d => d.id == a.doctorId);

        appointmentList.innerHTML += `
            <div class='appointment-card'>
                <strong>${a.patient}</strong><br>
                Doctor: ${doctor.name}<br>
                Date: ${a.date}<br>
                Time: ${a.slot}<br>
                Contact: ${a.contact}
            </div>
        `;
    });
}


// Submit form
document.getElementById("appointmentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const doctorId = doctorSelect.value;
    const date = document.getElementById("appointmentDate").value;
    const slot = timeSlotSelect.value;
    const patient = document.getElementById("patientName").value;
    const contact = document.getElementById("patientContact").value;

    appointments.push({ doctorId, date, slot, patient, contact });
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment booked successfully!");

    renderAppointments();
    loadTimeSlots();
});


// Real-time doctor filtering
searchDoctor.addEventListener("input", () => {
    loadDoctors(searchDoctor.value);
});

// Change events
doctorSelect.addEventListener("change", loadTimeSlots);
document.getElementById("appointmentDate").addEventListener("change", loadTimeSlots);


// Initial load
loadDoctors();
renderAppointments();
