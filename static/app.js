import { home_page } from "./modules/page_handlers/home.js";
import { assignment, chat_page } from "./modules/page_handlers/assignment.js";

let main = document.querySelector('main');

let current_page = JSON.parse(localStorage.getItem('current_page')) || null;
let pages = {};

window.onload = () => {

    initiate_pages();

    current_page = pages.chat_page;
    current_page.activate_page();


};

const initiate_pages = () => {

    pages.home_page = new home_page(main);
    pages.assignment = new assignment(main);
    pages.chat_page = new chat_page(main);

};

const set_default_page = () => {

    current_page = pages.chat_page;
    current_page.activate_page();

};

const switch_page = (e) => {

    if (e) {

        current_page = pages[e.detail.page];

    };
    
    if (current_page.parent_page != null) {


        pages[current_page.parent_page].activate_page();

    };

    current_page.activate_page();

    let page_key = Object.keys(pages);
    page_key = page_key.find(key => pages[key] === current_page);

    localStorage.setItem('current_page', JSON.stringify(page_key));

}

document.addEventListener('switch_page', switch_page);