import { loadTexts, loadEvents, loadOrganizers, loadPartners } from './utils.js';

async function init() {
    try {
        const [texts, events, organizersData, partnersData] = await Promise.all([
            loadTexts(),
            loadEvents(),
            loadOrganizers(),
            loadPartners()
        ]);

        renderNavigation(texts.nav);
        renderHero(texts.hero, events);
        renderEvents(texts.events, events);
        renderCommunity(texts.community, organizersData.organizers);
        renderPartners(texts.partnership, partnersData.partners);
        renderFooter(texts.footer);

        setupMobileMenu(texts.accessibility);

    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

function renderNavigation(nav) {
    const desktopNav = document.querySelector('nav.hidden.md\\:flex');
    const mobileNav = document.querySelector('#mobile-menu nav');

    if (!nav || !nav.links) return;

    const createLinks = (isMobile) => nav.links.map(link => `
    <a href="${link.href}" class="${isMobile ? 'block py-2 text-lg text-gray-700 hover:text-blue-700' : 'text-gray-700 hover:text-blue-700 font-medium transition-colors'}">
      ${link.label}
    </a>
  `).join('');

    if (desktopNav) desktopNav.innerHTML = createLinks(false);
    if (mobileNav) mobileNav.innerHTML = createLinks(true);
}

function renderHero(hero, events) {
    const container = document.querySelector('#hero .container');
    if (!container || !hero) return;

    const statsHtml = hero.stats.map(stat => `
    <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-bold text-${stat.color}-700">${stat.value}</span>
        <span class="text-gray-600 text-sm md:text-base mt-2">${stat.label}</span>
    </div>
  `).join('');

    const ctaHtml = hero.cta.map(btn => {
        const isFilled = btn.style === 'filled';
        const isOutline = btn.style === 'outline';
        const classes = isFilled
            ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg hover:shadow-xl'
            : isOutline
                ? 'border-2 border-blue-700 text-blue-700 hover:bg-blue-50'
                : 'text-gray-600 hover:text-blue-700 underline decoration-2 underline-offset-4';

        return `<a href="${btn.href}" ${btn.external ? 'target="_blank" rel="noopener"' : ''} class="px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center ${classes}">${btn.label}</a>`;
    }).join('');

    container.innerHTML = `
    <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
      <span class="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
        ${hero.claim.line1}
      </span><br/>
      <span class="text-gray-900">${hero.claim.line2}</span>
    </h1>
    
    <div class="max-w-2xl mx-auto space-y-4 mb-10 text-lg md:text-xl text-gray-600 leading-relaxed">
      ${hero.intro.map(p => `<p>${p}</p>`).join('')}
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
      ${ctaHtml}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-gray-200">
       ${statsHtml}
    </div>
    
    <div class="mt-8">
      <p class="text-sm text-gray-400 font-bold tracking-widest uppercase mb-4">${hero.partnersLabel}</p>
      <div class="flex gap-8 justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
         <img src="/images/partners/gug-logo.svg" alt="GUG.cz" class="h-8 md:h-10 w-auto">
         <img src="/images/partners/cerna-kostka-logo.svg" alt="Černá Kostka" class="h-8 md:h-10 w-auto">
      </div>
    </div>
  `;
}

function renderEvents(texts, events) {
    const container = document.querySelector('#akce .container');
    const grid = document.querySelector('#events-grid');
    if (!container || !grid || !texts) return;

    // Add Header
    const header = document.createElement('div');
    header.className = 'text-center max-w-3xl mx-auto mb-12';
    header.innerHTML = `
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      <span class="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">${texts.heading.split(' ')[0]}</span> 
      ${texts.heading.split(' ').slice(1).join(' ')}
    </h2>
    <p class="text-xl text-gray-600">${texts.subheading}</p>
  `;
    container.insertBefore(header, grid);

    // Render Cards
    grid.innerHTML = events.map(event => {
        const isPast = event.status === 'past';
        const isSoldOut = event.status === 'sold-out';

        const statusLabel = texts.statusLabels[event.status];
        const statusColor = isPast ? 'gray' : isSoldOut ? 'red' : 'green';

        // Media path
        const coverImage = event.media && event.media.cover
            ? `${event.basePath}${event.media.cover}`
            : '/images/placeholder-event.svg';

        let buttonsHtml = '';
        if (isPast) {
            buttonsHtml = `<a href="#" class="w-full block text-center px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors">${texts.buttons.showRecap}</a>`;
        } else if (isSoldOut) {
            buttonsHtml = `<button disabled class="w-full block px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">${texts.buttons.soldOut}</button>`;
        } else {
            buttonsHtml = `
         <div class="grid grid-cols-2 gap-3">
           <a href="${event.lumaLink}" target="_blank" class="block text-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">${texts.buttons.buyTicket}</a>
           <a href="#event-detail-${event.id}" class="block text-center px-4 py-2 border-2 border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">${texts.buttons.learnMore}</a>
         </div>
       `;
        }

        return `
      <article class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
        <div class="relative h-48 sm:h-64 bg-gray-100 overflow-hidden group">
          <img src="${coverImage}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-4 right-4 px-3 py-1 bg-${statusColor}-700 text-white text-sm font-bold rounded-full shadow-md">
            ${statusLabel}
          </span>
        </div>
        
        <div class="p-6 md:p-8 flex flex-col flex-grow">
          <h3 class="text-2xl font-bold mb-2 text-gray-900">${event.title}</h3>
          
          <div class="space-y-3 mb-6 flex-grow">
             <div class="flex items-center text-gray-600">
                <span class="w-24 font-medium text-gray-400">${texts.infoLabels.date}</span>
                <span class="font-medium">${event.date}</span>
             </div>
             <div class="flex items-center text-gray-600">
                <span class="w-24 font-medium text-gray-400">${texts.infoLabels.time}</span>
                <span>${event.time}</span>
             </div>
             <div class="flex items-center text-gray-600">
                <span class="w-24 font-medium text-gray-400">${texts.infoLabels.location}</span>
                <span>${event.location}</span>
             </div>
             
             ${!isPast ? `
             <div class="flex items-center text-gray-600 mt-4 pt-4 border-t border-gray-100">
                <span class="w-24 font-medium text-gray-400">${texts.infoLabels.price}</span>
                <span class="font-bold text-gray-900">${event.price}</span>
             </div>
             ` : ''}
          </div>

          <div class="mt-auto">
            ${buttonsHtml}
          </div>
        </div>
      </article>
    `;
    }).join('');

    // Add View All button
    const footer = document.createElement('div');
    footer.className = 'text-center mt-16';
    footer.innerHTML = `
    <button class="inline-flex items-center font-bold text-blue-700 hover:text-blue-900 transition-colors group">
      ${texts.viewAllButton}
      <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
    </button>
  `;
    container.appendChild(footer);
}

function renderCommunity(texts, organizers) {
    const container = document.querySelector('#komunita .container');
    const grid = document.querySelector('#organizers-grid');
    if (!container || !grid || !texts) return;

    const header = document.createElement('div');
    header.className = 'max-w-3xl mx-auto mb-16';
    header.innerHTML = `
    <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
       <span class="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">${texts.heading.split(' ')[0]}</span>
       ${texts.heading.split(' ').slice(1).join(' ')}
    </h2>
    <div class="space-y-4 text-lg text-gray-600 leading-relaxed">
       ${texts.paragraphs.map(p => `<p>${p}</p>`).join('')}
    </div>
    <h3 class="text-2xl font-bold mt-16 text-center">${texts.organizersHeading}</h3>
  `;
    container.insertBefore(header, grid);

    grid.innerHTML = organizers.map(org => `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      <img src="${org.image}" alt="${org.name}" class="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-50">
      <h4 class="text-xl font-bold mb-1">${org.name}</h4>
      <p class="text-gray-600 text-sm mb-4 flex-grow">${org.bio}</p>
      <a href="${org.linkedin}" target="_blank" class="text-blue-700 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors" aria-label="LinkedIn">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
      </a>
    </div>
  `).join('');
}

function renderPartners(texts, partners) {
    const container = document.querySelector('#partneri .container');
    if (!container || !texts) return;

    const benefitsHtml = texts.benefits.map(b => `
    <li class="flex items-center gap-3 text-gray-700">
      <svg class="w-5 h-5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      ${b}
    </li>
  `).join('');

    const ctaHtml = texts.cta.map(btn => {
        const isSecondary = btn.style === 'secondary';
        const classes = isSecondary
            ? 'text-gray-600 hover:text-blue-700 underline'
            : 'border-2 border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium';

        return `<a href="${btn.href}" class="${classes} transition-colors inline-block text-center">${btn.label}</a>`;
    }).join('');

    container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
           <span class="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">${texts.heading.split(' ')[0]}</span>
           ${texts.heading.split(' ').slice(1).join(' ')}
        </h2>
        <div class="space-y-4 text-lg text-gray-600 mb-8">
           ${texts.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
        
        <ul class="space-y-3 mb-10">
           ${benefitsHtml}
        </ul>

        <div class="flex flex-col sm:flex-row gap-6 items-center">
           ${ctaHtml}
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-8">
         ${partners.map(p => `
           <a href="${p.url}" target="_blank" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow h-48 group">
             <img src="${p.logo}" alt="${p.name}" class="max-h-16 w-auto opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all">
           </a>
         `).join('')}
      </div>
    </div>
  `;
}

function renderFooter(texts) {
    const container = document.querySelector('#footer .container');
    if (!container || !texts) return;

    const linksHtml = (section) => section.links.map(link => `
    <li><a href="${link.href}" class="text-gray-500 hover:text-blue-700 transition-colors">${link.label}</a></li>
  `).join('');

    container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <div>
        <a href="#" class="text-xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent block mb-4">
          FAJNE PROMPTY
        </a>
        <p class="text-gray-500 mb-6">${texts.description}</p>
      </div>

      <div>
        <h4 class="font-bold mb-6 text-gray-900">${texts.sections.navigation.heading}</h4>
        <ul class="space-y-3">
          ${linksHtml(texts.sections.navigation)}
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6 text-gray-900">${texts.sections.contact.heading}</h4>
        <ul class="space-y-3 text-gray-500">
          <li><a href="mailto:${texts.sections.contact.email}" class="hover:text-blue-700 transition-colors">${texts.sections.contact.email}</a></li>
          <li>${texts.sections.contact.phone}</li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6 text-gray-900">${texts.sections.social.heading}</h4>
        <div class="flex gap-4">
           ${texts.sections.social.links.map(l => `
             <a href="${l.href}" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-all transform hover:scale-110">
               <span class="sr-only">${l.label}</span>
               <!-- Using a generic icon for now, would use specific icons based on l.icon -->
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.492 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg> 
             </a>
           `).join('')}
        </div>
      </div>
    </div>

    <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
      <p>${texts.copyright}</p>
      <div class="flex items-center gap-2">
        <span>${texts.organizer.label}</span>
        <a href="${texts.organizer.href}" class="font-bold text-gray-900 hover:text-blue-700 transition-colors">${texts.organizer.name}</a>
      </div>
    </div>
  `;
}

function setupMobileMenu(a11y) {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('hidden');
            btn.setAttribute('aria-label', !isExpanded ? a11y.closeMenu : a11y.menuToggle);
        });

        // Close menu when clicking links
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-label', a11y.menuToggle);
            });
        });
    }
}

init();
