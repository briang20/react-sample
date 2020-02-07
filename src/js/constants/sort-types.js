export const sortTypes = {
    asc_by_id: {
        fn: (a, b) => a.id - b.id
    },
    dsc_by_id: {
        fn: (a, b) => b.id - a.id
    },
    asc_by_name: {
        fn: (a, b) => {
            const nameA = a.name ? a.name.toUpperCase() : '';
            const nameB = b.name ? b.name.toUpperCase() : '';
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
    },
    dsc_by_name: {
        fn: (a, b) => {
            const nameA = a.name ? a.name.toUpperCase() : '';
            const nameB = b.name ? b.name.toUpperCase() : '';
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        }
    },
    asc_by_username: {
        fn: (a, b) => {
            const nameA = a.username ? a.username.toUpperCase() : '';
            const nameB = b.username ? b.username.toUpperCase() : '';
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
    },
    dsc_by_username: {
        fn: (a, b) => {
            const nameA = a.username ? a.username.toUpperCase() : '';
            const nameB = b.username ? b.username.toUpperCase() : '';
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        }
    },
    asc_by_email: {
        fn: (a, b) => {
            const nameA = a.email ? a.email.toUpperCase() : '';
            const nameB = b.email ? b.email.toUpperCase() : '';
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
    },
    dsc_by_email: {
        fn: (a, b) => {
            const nameA = a.email ? a.email.toUpperCase() : '';
            const nameB = b.email ? b.email.toUpperCase() : '';
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        }
    },
    asc_by_website: {
        fn: (a, b) => {
            const nameA = a.website ? a.website.toUpperCase() : '';
            const nameB = b.website ? b.website.toUpperCase() : '';
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
    },
    dsc_by_website: {
        fn: (a, b) => {
            const nameA = a.website ? a.website.toUpperCase() : '';
            const nameB = b.website ? b.website.toUpperCase() : '';
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        }
    },
    default: {
        fn: (a, b) => a
    }
};