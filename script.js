document.addEventListener("DOMContentLoaded", function () {
    const mapSection = document.getElementById("mapSection");
    const ipListSection = document.getElementById("ipListSection");
    const optionsSection = document.getElementById("optionsSection");

    const mapBtn = document.getElementById("mapBtn");
    const ipListBtn = document.getElementById("ipListBtn");
    const optionsBtn = document.getElementById("optionsBtn");

    const hamburger = document.getElementById("hamburger");
    const flyoutMenu = document.getElementById("flyoutMenu");
    const content = document.querySelector(".content");

    const ipListElement = document.getElementById("ipList");

    // Function to show a specific section
    function showSection(sectionToShow) {
        mapSection.style.display = 'none';
        ipListSection.style.display = 'none';
        optionsSection.style.display = 'none';
        sectionToShow.style.display = 'block';
    }

    // Default view: show the map section
    showSection(mapSection);

    mapBtn.addEventListener("click", function () {
        showSection(mapSection);
        hideFlyoutMenu();
    });
    ipListBtn.addEventListener("click", function () {
        showSection(ipListSection);
        hideFlyoutMenu();
        displayIPList();
    });
    optionsBtn.addEventListener("click", function () {
        showSection(optionsSection);
        hideFlyoutMenu();
    });

    hamburger.addEventListener("click", function () {
        flyoutMenu.classList.toggle("open");
        content.classList.toggle("open");
        hamburger.classList.toggle("open");
        if (hamburger.classList.contains("open")) {
            hamburger.classList.remove("closed");
            hamburger.classList.add("open");
        } else {
            hamburger.classList.remove("open");
            hamburger.classList.add("closed");
        }
    });

    // Function to hide the flyout menu
    function hideFlyoutMenu() {
        flyoutMenu.classList.remove("open");
        content.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.classList.add("closed");
    }

    // Function to display IP list dynamically from the JSON file
    function displayIPList() {
        // Fetch the JSON data (assuming the JSON file is available at the correct path)
        fetch('iplist.json')
            .then(response => response.json())
            .then(data => {
                // Clear any existing list items
                ipListElement.innerHTML = '';

                // Loop through the IP list and create list items
                data.forEach(ipObject => {
                    const listItem = document.createElement('li');
                    listItem.innerText = `IP: ${ipObject.ForeignAddress} | Location: (${ipObject.Latitude}, ${ipObject.Longitude})`;
                    ipListElement.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error loading IP data:', error);
            });
    }

    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define custom marker icon
    const coolIcon = L.divIcon({
        className: 'cool-marker',
        html: '<div class="marker-circle"></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // Sample IP List (Replace with your actual IP list if needed)
    const ipList = [
        { ip: "192.168.1.1", lat: 51.505, lon: -0.09, state: "ESTABLISHED" },
        { ip: "10.0.0.1", lat: 40.7128, lon: -74.0060, state: "ESTABLISHED" },
        { ip: "172.16.0.1", lat: 34.0522, lon: -118.2437, state: "ESTABLISHED" }
    ];

    // Loop through the IP List and add markers for each IP
    ipList.forEach(function (ipObj) {
        if (ipObj.state === "ESTABLISHED") {
            const marker = L.marker([ipObj.lat, ipObj.lon], { icon: coolIcon }).addTo(map);
            marker.bindPopup(`IP: ${ipObj.ip}`).openPopup(); // Display the IP on hover or click
            marker.on('mouseover', function () {
                marker.bindPopup(`IP: ${ipObj.ip}`).openPopup();
            });
            marker.on('mouseout', function () {
                marker.closePopup();
            });
        }
    });

    // Zoom functionality
    const zoomLevelInput = document.getElementById('zoomLevel');
    zoomLevelInput.addEventListener('input', function () {
        map.setZoom(parseInt(zoomLevelInput.value, 10));
    });
});
