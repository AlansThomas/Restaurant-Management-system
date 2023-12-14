import debounce from "lodash.debounce";

export const infiniteScrollTrigerFunction = (scrollfn) => debounce((e) => {
    if (e.target.scrollTop + 2 >= e.target.scrollHeight - e.target.clientHeight) {
        scrollfn();
    }
}, 300);