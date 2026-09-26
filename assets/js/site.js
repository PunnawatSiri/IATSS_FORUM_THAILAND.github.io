const footerYear = document.getElementById('year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

        const projectDatabase = window.projectDatabase || [];

        let currentSGHSFilter = 'all';
        let selectedProjectId = 'proj-2024-1';

        // Render Projects List in Chronological Order
        function renderProjectsList() {
            const container = document.getElementById('projects-list-container');
            if (!container) return;

            const filtered = projectDatabase.filter(p => {
                return (currentSGHSFilter === 'all') || (p.sghs === currentSGHSFilter);
            }).sort((a, b) => b.sortDate - a.sortDate);

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="glass-card p-8 rounded-2xl text-center text-apple-secondary dark:text-apple-darksecondary">
                        No projects match the selected SDG category.
                    </div>
                `;
                return;
            }

            container.innerHTML = '';

            filtered.forEach(proj => {
                const isSelected = proj.id === selectedProjectId;
                const card = document.createElement('div');
                card.className = `glass-card p-4 rounded-2xl border ${isSelected ? 'border-2 border-iatss shadow-md bg-iatss-light/40 dark:bg-iatss/15' : 'border-apple-border dark:border-apple-darkborder hover:border-iatss/40'} cursor-pointer transition-all duration-300 flex flex-col sm:flex-row gap-4 items-center group relative`;
                card.onclick = event => {
                    if (event.target.closest('a')) return;
                    selectProject(proj.id);
                };

                const sghsBadgeColor = proj.sghs === 'Economy' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                       proj.sghs === 'Society' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                                       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';

                card.innerHTML = `
                    <div class="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden relative border border-apple-border/50 dark:border-apple-darkborder/50">
                        <img src="${proj.image}" alt="${proj.name}" class="protected-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div class="absolute inset-0 bg-black/10" oncontextmenu="return false;"></div>
                    </div>
                    <div class="flex-grow space-y-1.5 text-left w-full">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${sghsBadgeColor}">${proj.sghs}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-apple-subtle dark:bg-apple-darksubtle text-apple-secondary dark:text-apple-darksecondary border border-apple-border/60">${proj.dateLabel}</span>
                            <span class="text-xs font-semibold text-iatss flex items-center gap-1 ml-auto">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                ${proj.location}
                            </span>
                        </div>
                        <h3 class="text-sm font-bold text-apple-text dark:text-apple-darktext group-hover:text-iatss transition-colors leading-snug"><a href="${proj.url}" class="hover:underline">${proj.name}</a></h3>
                        <p class="text-xs text-apple-secondary dark:text-apple-darksecondary line-clamp-2 leading-relaxed">${proj.detail}</p>
                    </div>
                `;

                container.appendChild(card);
            });
        }

        // Render Thailand Map Pins & Blinking Marker
        function renderMapPins() {
            const layer = document.getElementById('map-pins-layer');
            if (!layer) return;

            layer.innerHTML = '';

            projectDatabase.forEach(proj => {
                const isSelected = proj.id === selectedProjectId;
                const pin = document.createElement('div');
                pin.style.left = `${proj.mapCoords.x}%`;
                pin.style.top = `${proj.mapCoords.y}%`;
                pin.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group';
                pin.onclick = () => selectProject(proj.id);

                if (isSelected) {
                    // Blinking Radar Spot for selected project
                    pin.innerHTML = `
                        <div class="relative flex items-center justify-center">
                            <span class="absolute inline-flex h-9 w-9 rounded-full bg-iatss opacity-75 animate-ping"></span>
                            <span class="absolute inline-flex h-6 w-6 rounded-full bg-iatss/40 animate-pulse"></span>
                            <div class="relative w-4.5 h-4.5 rounded-full bg-iatss border-2 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-white text-[8px] font-bold">●</div>
                            <div class="absolute bottom-full mb-2 whitespace-nowrap bg-apple-text dark:bg-white text-white dark:text-apple-text text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl z-30">
                                ${proj.location} (${proj.year})
                            </div>
                        </div>
                    `;
                } else {
                    pin.innerHTML = `
                        <div class="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border border-white dark:border-slate-900 hover:bg-iatss hover:scale-125 transition-all shadow-sm"></div>
                    `;
                }

                layer.appendChild(pin);
            });

            // Update Map Info Callout Banner
            const activeProj = projectDatabase.find(p => p.id === selectedProjectId);
            if (activeProj) {
                document.getElementById('active-map-location-name').textContent = activeProj.location + ', Thailand';
                document.getElementById('map-info-title').textContent = activeProj.name;
                document.getElementById('map-info-year').textContent = activeProj.year;
                document.getElementById('map-info-desc').textContent = `${activeProj.sghs} Pillar — ${activeProj.detail}`;
            }
        }

        function selectProject(id) {
            selectedProjectId = id;
            renderProjectsList();
            renderMapPins();
        }

        function filterProjects(category) {
            currentSGHSFilter = category;
            const buttons = document.querySelectorAll('.sghs-btn');
            buttons.forEach(btn => {
                btn.className = "sghs-btn px-3.5 py-1.5 text-xs font-semibold rounded-full text-apple-secondary dark:text-apple-darksecondary hover:text-iatss transition-all duration-200";
            });

            const activeBtn = document.getElementById(`sghs-filter-${category}`);
            if (activeBtn) {
                activeBtn.className = "sghs-btn active-sghs px-3.5 py-1.5 text-xs font-bold rounded-full bg-iatss text-white shadow-sm transition-all duration-200";
            }

            renderProjectsList();
        }

        const alumniData = [
            { id: 1, row: 1, name: "Somsak Jaidee", nickname: "Sak", batch: 1, position: "Former Lecturer", place: "Prince of Songkla University" },
            { id: 2, row: 2, name: "Pranee Wong", nickname: "Nee", batch: 1, position: "Head of English Department", place: "Suan Dusit Rajapat Institute" },
            { id: 3, row: 3, name: "Kitti Suwan", nickname: "Kit", batch: 2, position: "Assistant Professor", place: "Chulalongkorn University" },
            { id: 4, row: 4, name: "Anan Kaew", nickname: "Nan", batch: 2, position: "Traffic Inspector", place: "Khon Kaen Police Traffic" },
            { id: 5, row: 5, name: "Wichai Chai", nickname: "Chai", batch: 3, position: "Technical Officer", place: "Ministry of Public Health" },
            { id: 8, row: 8, name: "Malee Rung", nickname: "Lee", batch: 3, position: "Environmentalist", place: "National Environment Board" },
            { id: 9, row: 9, name: "Somchai Boon", nickname: "Som", batch: 4, position: "Advisor", place: "Bangkok Metro Plc." },
            { id: 10, row: 10, name: "Nipon Suk", nickname: "Pon", batch: 4, position: "Instructor", place: "Chiang Mai University" }
        ];

        let alumniNetwork = null;
        let alumniNodes = null;

        function initAlumniNetwork() {
            const container = document.getElementById('network-container');
            if (!container || typeof vis === 'undefined') return;

            alumniNodes = new vis.DataSet(alumniData.map(alumnus => ({
                id: alumnus.id,
                label: alumnus.nickname,
                title: `${alumnus.nickname}: ${alumnus.position}`,
                shape: 'circularImage',
                image: `https://api.dicebear.com/7.x/bottts/svg?seed=AlumniRow${alumnus.row}`,
                brokenImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Alumni',
                size: 24,
                color: { background: '#006954', border: '#8ac9bb', highlight: { background: '#004d3d', border: '#006954' } },
                font: { color: '#ffffff', size: 11 },
                borderWidth: 2,
                data: { ...alumnus, image: `https://api.dicebear.com/7.x/bottts/svg?seed=AlumniRow${alumnus.row}` }
            })));

            const edges = [
                { from: 1, to: 3, value: 0.45 },
                { from: 1, to: 10, value: 0.52 },
                { from: 3, to: 10, value: 0.65 },
                { from: 5, to: 8, value: 0.58 }
            ].map(edge => ({ ...edge, color: { color: 'rgba(0, 105, 84, 0.28)' } }));

            alumniNetwork = new vis.Network(container, { nodes: alumniNodes, edges: new vis.DataSet(edges) }, {
                physics: { solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -40, springLength: 80 } },
                interaction: { hover: true, navigationButtons: false },
                nodes: { borderWidth: 2 }
            });

            alumniNetwork.on('click', params => {
                if (params.nodes.length > 0) {
                    const node = alumniNodes.get(params.nodes[0]);
                    if (node && node.data) openAlumniModal(node.data);
                }
            });
        }

        function setAlumniLayout(type) {
            if (!alumniNetwork || !alumniNodes) return;
            const professionButton = document.getElementById('btn-profession');
            const batchButton = document.getElementById('btn-batch');
            const activeClasses = 'bg-iatss text-white shadow-sm';
            const inactiveClasses = 'bg-apple-subtle dark:bg-apple-darksubtle text-apple-secondary dark:text-apple-darksecondary';
            professionButton.className = `px-4 py-2.5 rounded-full text-xs font-semibold transition hover:text-iatss ${type === 'profession' ? activeClasses : inactiveClasses}`;
            batchButton.className = `px-4 py-2.5 rounded-full text-xs font-semibold transition hover:text-iatss ${type === 'batch' ? activeClasses : inactiveClasses}`;

            if (type === 'profession') {
                alumniNetwork.setOptions({ physics: { enabled: true }, edges: { hidden: false } });
                return;
            }

            alumniNetwork.setOptions({ physics: { enabled: false }, edges: { hidden: true } });
            const batches = [...new Set(alumniData.map(alumnus => alumnus.batch))].sort((a, b) => a - b);
            const batchPositions = [];
            batches.forEach((batch, batchIndex) => {
                const members = alumniData.filter(alumnus => alumnus.batch === batch);
                const spacing = 150;
                const startX = -((members.length - 1) * spacing) / 2;
                members.forEach((alumnus, memberIndex) => {
                    batchPositions.push({
                        id: alumnus.id,
                        x: startX + (memberIndex * spacing),
                        y: batchIndex * 150
                    });
                });
            });
            alumniNodes.update(batchPositions);
            alumniNetwork.fit({ animation: true });
        }

        function openAlumniModal(alumnus) {
            document.getElementById('modalImg').src = alumnus.image;
            document.getElementById('modalRow').textContent = `Row #${alumnus.row}`;
            document.getElementById('modalName').textContent = alumnus.name;
            document.getElementById('modalNickname').textContent = `"${alumnus.nickname}"`;
            document.getElementById('modalBatch').textContent = `Batch ${alumnus.batch}`;
            document.getElementById('modalPosition').textContent = alumnus.position || 'N/A';
            document.getElementById('modalPlace').textContent = alumnus.place || 'N/A';
            document.getElementById('detailModal').classList.remove('hidden');
            document.getElementById('detailModal').classList.add('flex');
        }

        function closeAlumniModal() {
            document.getElementById('detailModal').classList.add('hidden');
            document.getElementById('detailModal').classList.remove('flex');
        }

        // Photo Database for Bento Grid
        const photoDatabase = {
            program: [
                { title: "Suzuka Campus Leadership Seminar", tag: "Suzuka, Japan", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-2", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80" },
                { title: "Cross-Cultural Workshop", tag: "Knowledge Exchange", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" },
                { title: "Sustainable Mobility Site Visit", tag: "Field Study", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" },
                { title: "Group Synergy & Problem Solving", tag: "Teamwork", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80" },
                { title: "Japanese Cultural Immersion", tag: "Mie Prefecture", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
                { title: "Final Forum Presentation", tag: "Leadership", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80" }
            ],
            alumni: [
                { title: "Thailand Alumni Annual Gathering", tag: "Bangkok, Thailand", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-2", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80" },
                { title: "Community Environmental Project", tag: "Eco Initiative", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" },
                { title: "Mentorship & Selection Panel", tag: "DCCE Secretariat", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" },
                { title: "ASEAN Alumni Summit", tag: "Regional Impact", colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80" },
                { title: "Smart Mobility Forum Thailand", tag: "Urban Innovation", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
                { title: "Youth Leadership Dialogue", tag: "Future Generation", colSpan: "col-span-1", rowSpan: "row-span-1", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" }
            ]
        };

        function shuffleArray(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function renderBentoGrid(category) {
            const container = document.getElementById('bento-container');
            if (!container) return;

            const items = shuffleArray(photoDatabase[category]);
            container.innerHTML = '';

            items.forEach((item) => {
                const card = document.createElement('div');
                card.className = `${item.colSpan} ${item.rowSpan} group relative overflow-hidden rounded-3xl bg-apple-subtle dark:bg-apple-darksubtle apple-shadow border border-apple-border/50 dark:border-apple-darkborder/50 select-none`;
                
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.title}" class="protected-img absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div class="absolute inset-0 z-10" oncontextmenu="return false;" ondragstart="return false;"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-5 z-20 text-white transform group-hover:translate-y-0 transition-transform">
                        <span class="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-iatss/90 backdrop-blur-md mb-2">${item.tag}</span>
                        <h3 class="text-base sm:text-lg font-bold leading-snug drop-shadow-sm">${item.title}</h3>
                    </div>
                `;

                container.appendChild(card);
            });
        }

        function setBentoCategory(category) {
            const btnProg = document.getElementById('btn-bento-program');
            const btnAlum = document.getElementById('btn-bento-alumni');

            if (category === 'program') {
                btnProg.className = "px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 bg-iatss text-white shadow-sm";
                btnAlum.className = "px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 text-apple-secondary dark:text-apple-darksecondary hover:text-apple-text dark:hover:text-apple-darktext";
            } else {
                btnAlum.className = "px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 bg-iatss text-white shadow-sm";
                btnProg.className = "px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 text-apple-secondary dark:text-apple-darksecondary hover:text-apple-text dark:hover:text-apple-darktext";
            }

            renderBentoGrid(category);
        }

        // Disable Context Menu / Saving on Protected Images
        document.addEventListener('contextmenu', function(e) {
            if (e.target.classList.contains('protected-img') || e.target.closest('#bento-container')) {
                e.preventDefault();
                return false;
            }
        });

        function toggleTheme() {
            const html = document.documentElement;
            const sunIcon = document.getElementById('theme-toggle-sun-icon');
            const moonIcon = document.getElementById('theme-toggle-moon-icon');

            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('iatss_theme', 'light');
                if (sunIcon && moonIcon) {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                }
            } else {
                html.classList.add('dark');
                localStorage.setItem('iatss_theme', 'dark');
                if (sunIcon && moonIcon) {
                    moonIcon.classList.add('hidden');
                    sunIcon.classList.remove('hidden');
                }
            }
        }

        (function initTheme() {
            const savedTheme = localStorage.getItem('iatss_theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
                const moonIcon = document.getElementById('theme-toggle-moon-icon');
                const sunIcon = document.getElementById('theme-toggle-sun-icon');
                if (moonIcon && sunIcon) {
                    moonIcon.classList.add('hidden');
                    sunIcon.classList.remove('hidden');
                }
            }
        })();

        let animated = false;
        function animateCounters() {
            if (animated) return;
            animated = true;

            const animateValue = (id, start, end, duration) => {
                const obj = document.getElementById(id);
                if (!obj) return;
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    obj.innerHTML = Math.floor(progress * (end - start) + start);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            };

            animateValue("counter-alumni", 0, 250, 1800);
            animateValue("counter-professions", 0, 18, 1500);
            animateValue("counter-years", 0, 40, 1600);
        }

        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
            document.getElementById('mobile-menu-btn').setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
        }

        function toggleNodeDetails(btn) {
            const card = btn.closest('div');
            const details = card.querySelector('.details-content');
            const chevron = btn.querySelector('.icon-chevron');
            
            if (details) {
                details.classList.toggle('hidden');
                if (chevron) {
                    chevron.classList.toggle('rotate-180');
                }
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('counter-alumni')) setTimeout(animateCounters, 200);
            renderBentoGrid('program');
            renderProjectsList();
            renderMapPins();
            initAlumniNetwork();
        });