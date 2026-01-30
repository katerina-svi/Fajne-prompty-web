/**
 * Load global texts
 */
export async function loadTexts() {
    const res = await fetch('/content/texts.json');
    return res.json();
}

/**
 * Load organizers data
 */
export async function loadOrganizers() {
    const res = await fetch('/content/organizers.json');
    return res.json();
}

/**
 * Load partners data
 */
export async function loadPartners() {
    const res = await fetch('/content/partners.json');
    return res.json();
}

/**
 * Load events data
 */
export async function loadEvents() {
    try {
        const indexRes = await fetch('/content/events/index.json');
        if (!indexRes.ok) throw new Error('Failed to load events index');

        const { events: ids } = await indexRes.json();

        const events = await Promise.all(ids.map(async (id) => {
            try {
                const res = await fetch(`/content/events/${id}/event.json`);
                if (!res.ok) return null;
                const event = await res.json();
                event.basePath = `/content/events/${id}/`;
                return event;
            } catch (e) {
                console.error(`Failed to load event ${id}`, e);
                return null;
            }
        }));

        const validEvents = events.filter(e => e !== null);

        // Sort events by date (newest first)? Or closest future date?
        // PRD doesn't specify sort, but usually upcoming first.
        // For now returning as is, but we might want to sort.
        return validEvents.sort((a, b) => {
            // Simple date parsing assuming "d. m. yyyy" format
            const parseDate = (d) => {
                const parts = d.split('. ');
                if (parts.length < 3) return new Date();
                return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            };
            return parseDate(b.date) - parseDate(a.date);
        });

    } catch (e) {
        console.error("Error loading events:", e);
        return [];
    }
}
