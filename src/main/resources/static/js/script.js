document.getElementById("time").innerHTML =
    new Date().toLocaleTimeString();


// ================= NEWS =================

fetch("/api/news")
    .then(r => r.json())
    .then(data => {

        let html = "";

        data.forEach(item => {

            html += `
                <div class="news-item">
                    <div class="news-date">${item.date}</div>
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </div>
            `;

        });

        document.getElementById("newsContainer").innerHTML = html;

    });


// ================= ANNOUNCEMENTS =================

fetch("/api/announcements")
    .then(r => r.json())
    .then(data => {

        let html = "";

        data.forEach(item => {

            html += `
                <div class="announcement">
                    <p>${item.content}</p>
                    <small>${item.title}</small>
                </div>
            `;

        });

        document.getElementById("announcementContainer").innerHTML = html;

    });


// ================= POLICIES =================

fetch("/api/policy")
    .then(r => r.json())
    .then(data => {

        let html = "";

        data.forEach(item => {

            html += `
                <div class="policy">
                    <span>${item.title}</span>
                    <span>→</span>
                </div>
            `;

        });

        document.getElementById("policyContainer").innerHTML = html;

    });


// ================= HOLIDAYS =================

fetch("/api/holidays")
    .then(r => r.json())
    .then(data => {

        let html = "";

        data.forEach(item => {

            html += `
                <div class="holiday">
                    <span>${item.date}</span>
                    <span>${item.holidayName}</span>
                    <span>${item.type}</span>
                </div>
            `;

        });

        document.getElementById("holidayContainer").innerHTML = html;

    });