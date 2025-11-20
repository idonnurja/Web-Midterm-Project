// JavaScript per Funksionalitetin (i integruar)

        const loginFormContainer = document.getElementById('login-form-container');
        const dashboard = document.getElementById('dashboard');
        const loginForm = document.getElementById('login-form');
        const userInfo = document.getElementById('user-info');
        
        // FUSHA E AMORTIZIMIT
        const vfillestare = document.getElementById('vfillestare');
        const dataHyrjes = document.getElementById('data_hyrjes');
        const dataSotme = document.getElementById('data_sotme');
        const amortizationResult = document.getElementById('amortization-result');
        const vleraMbeturCell = document.getElementById('vlera-mbetur');

        // FUNKSIONALITETI I KYÇJES DHE ROLEVE
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const role = document.getElementById('role').value;

            loginFormContainer.style.display = 'none';
            dashboard.style.display = 'block';
            
            let roleText = 'Përdorues Fundor';
            if (role === 'admin') roleText = 'Administrator (QKTB)';
            if (role === 'auditor') roleText = 'Auditues (Vetëm Lexim)';

            userInfo.innerHTML = `<i class="fas fa-user-circle"></i> Kyçur si: **${username}** (${roleText})`;
            
            calculate_amortization();
        });

        // FUNKSIONI I AMORTIZIMIT (KORRIGJUAR PER GABIMET E DATAVE)
        function calculate_amortization() {
            var initial_value = vfillestare.value;
            var start_date_str = dataHyrjes.value;
            var end_date_str = dataSotme.value;

            if (!initial_value || !start_date_str || !end_date_str || parseFloat(initial_value) <= 0) {
                amortizationResult.textContent = 'Amortizimi i Llogaritur: 0.00 ALL';
                vleraMbeturCell.textContent = parseFloat(initial_value).toFixed(2) + ' ALL';
                return;
            }

            var initial_value_num = parseFloat(initial_value);
            
            // Përdorimi i Date.UTC() për të shmangur gabimet e zonës kohore (Gabimi i gabuar = 0)
            var parts1 = start_date_str.split('-');
            var parts2 = end_date_str.split('-');

            var d1 = new Date(Date.UTC(parts1[0], parts1[1] - 1, parts1[2]));
            var d2 = new Date(Date.UTC(parts2[0], parts2[1] - 1, parts2[2]));

            var time1 = d1.getTime();
            var time2 = d2.getTime();

            if (time2 <= time1) {
                amortizationResult.textContent = 'Amortizimi i Llogaritur: 0.00 ALL';
                vleraMbeturCell.textContent = initial_value_num.toFixed(2) + ' ALL';
                return;
            }

            // Llogaritja e Numrit të Viteve (n)
            var diff_ms = time2 - time1; 
            var ms_in_year = 1000 * 60 * 60 * 24 * 365.25;
            var years_used = diff_ms / ms_in_year; 

            // Zbatimi i Formules (0.8^n)
            var depreciation_rate_factor = 0.8;
            var residual_factor = Math.pow(depreciation_rate_factor, years_used);
            
            // Llogarit Vleren e Amortizuar dhe Vlerën e Mbetur
            var residual_value = initial_value_num * residual_factor;
            var total_depreciation = initial_value_num - residual_value;
            
            // Vendos Vlerat (rrumbullakosur me 2 shifra)
            amortizationResult.textContent = `Amortizimi i Llogaritur: ${total_depreciation.toFixed(2)} ALL`;
            vleraMbeturCell.textContent = residual_value.toFixed(2) + ' ALL';
        }

        // EVENT LISTENERS PER AMORTIZIMIN
        vfillestare.addEventListener('input', calculate_amortization);
        dataHyrjes.addEventListener('change', calculate_amortization);
        dataSotme.addEventListener('change', calculate_amortization);
        
        // Thirr Amortizimin me ngarkimin e parë (pasi te jete kyçur)
        // Shënim: Ky funksion thirret pas kyçjes (ne loginForm.addEventListener)