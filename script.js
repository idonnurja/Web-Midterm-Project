 // Variablat e gjendjes globale
        let currentRole = '';
        let openConstatations = []; // Mbajmë Aktin Konstatues hapur
        const TOTAL_DEVICES = 150;   // numri total i pajisjeve në sistem

        // 1. Logjika e Ekranit të Ngarkimit (Splash Screen)
        document.addEventListener('DOMContentLoaded', () => {
            const splashScreen = document.getElementById('splash-screen');
            const loginContainer = document.getElementById('login-form-container');
            const splashDuration = 3000;

            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    loginContainer.style.display = 'flex';
                }, 500); 
            }, splashDuration);

            // 🔹 Ngarko konst-at nga localStorage
            const saved = localStorage.getItem('constatations');
            if (saved) {
                try {
                    openConstatations = JSON.parse(saved);
                } catch (e) {
                    openConstatations = [];
                }
            }

        // Përditëso menjëherë panelin e adminit (nëse hapet më vonë)
            updateAdminDashboard();
        });

        // 2. Logjika e Formës së Hyrjes
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('role').value;
            currentRole = role;

            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('current-user-role').textContent = role.toUpperCase();

            // Shfaq aplikacionin specifik bazuar në rol
            showRoleApp(role);
        });

        function showRoleApp(role) {
            // Fsheh të gjitha aplikacionet e roleve
            document.getElementById('teknik-app').style.display = 'none';
            document.getElementById('inxhinier-app').style.display = 'none';
            document.getElementById('admin-app').style.display = 'none';

            // Shfaq vetëm atë të duhurin
            if (role === 'teknik') {
                document.getElementById('teknik-app').style.display = 'block';
            } else if (role === 'inxhinier') {
                document.getElementById('inxhinier-app').style.display = 'block';
                // Përditëso njoftimet sapo inxhinieri kyçet
                updateInxhinierNotifications(); 
            } else if (role === 'administrator') {
                document.getElementById('admin-app').style.display = 'block';
                updateAdminDashboard();
            }
        }

        // 3. Logjika e Aktit të Konstatimit (TEKNIKU)
        function submitConstatation() {
            const deviceId = document.getElementById('device_id').value;
            const notes = document.getElementById('constatation_notes').value;
            const teknik = document.getElementById('username').value;

            if (!notes) {
                alert("Ju lutemi shkruani përshkrimin e dëmtimit!");
                return;
            }

            const newConst = {
                id: Date.now(),
                deviceId: deviceId,
                notes: notes,
                status: 'HAPUR',
                teknik: teknik
            };

            // 🔹 Shto në listë
            openConstatations.push(newConst);

            // 🔹 Ruaj në localStorage
            localStorage.setItem('constatations', JSON.stringify(openConstatations));

            alert(`Akt Konstatimi i dërguar për pajisjen ${deviceId}. Inxhinieri është njoftuar!`);
            document.getElementById('constatation_notes').value = '';

            // Përditëso panelin e inxhinierit dhe adminit
            updateInxhinierNotifications();
            updateAdminDashboard();
        }

        // 4. Logjika e Njoftimeve (INXHINIERI)
        function updateInxhinierNotifications() {
            const notificationsDiv = document.getElementById('inxhinier-notifications');
            notificationsDiv.innerHTML = '';

         const openOnes = openConstatations.filter(c => c.status === 'HAPUR');

            if (openOnes.length === 0) {
                notificationsDiv.innerHTML = '<p style="color: var(--success);"><i class="fas fa-check-circle"></i> Nuk ka Akt Konstatimi të hapur për momentin.</p>';
                return;
            }

            notificationsDiv.innerHTML = `
                <h3><i class="fas fa-exclamation-triangle"></i> DETYRA AKTIVE!</h3>
            `;

            openOnes.forEach(c => {
                notificationsDiv.innerHTML += `
                    <div class="notification-item">
                        <div>
                            Pajisja: ${c.deviceId}
                            <br>Konstatimi: ${c.notes}
                            <br>Hapur nga: ${c.teknik}
                        </div>
                        <button class="btn-success" onclick="completeRepair(${c.id})">
                            Kryej Riparimin / Mbyll Detyrën
                        </button>
                    </div>
                `;
            });
        }

        // 5. Logjika e Riparimit (INXHINIERI)
        function completeRepair(constatationId) {
            const index = openConstatations.findIndex(c => c.id === constatationId);

            if (index !== -1 && openConstatations[index].status === 'HAPUR') {
                openConstatations[index].status = 'MBYLLUR';

               alert(`Riparimi për pajisjen ${openConstatations[index].deviceId} u krye me sukses dhe Akti i Konstatimit u mbyll.`);

                // Ruaj në localStorage ndryshimin
                localStorage.setItem('constatations', JSON.stringify(openConstatations));

                // Përditëso të dy rolet
                updateInxhinierNotifications();
                updateAdminDashboard();
            }
        }

        function updateAdminDashboard() {
            // sa pajisje janë jo funksionale = numri i rasteve HAPUR
            const malfunctionCount = openConstatations.filter(c => c.status === 'HAPUR').length;

            // pajisje aktive = total - jo funksionale
            const activeCount = TOTAL_DEVICES - malfunctionCount;

            const activeSpan = document.getElementById('devices-active');
            const malSpan = document.getElementById('devices-malfunction');

            if (activeSpan) activeSpan.textContent = activeCount;
            if (malSpan) malSpan.textContent = malfunctionCount;
        }


        document.addEventListener('DOMContentLoaded', () => {
           
            const savedConstatations = localStorage.getItem('constatations');
            if (savedConstatations) {
                openConstatations = JSON.parse(savedConstatations);
            } else {
                openConstatations = [];
            }

            updateInxhinierNotifications(); 
        });
        
        // 6. Çkyçja
        function logout() {
            currentRole = '';
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('login-form-container').style.display = 'flex';
        }
