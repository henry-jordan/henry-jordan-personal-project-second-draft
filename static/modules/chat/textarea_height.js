export function textarea_height_handler(element, element_container) {

    const initial_height = element_container.clientHeight;
    
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.setAttribute('rows', 1);
    clone.style.height = 'auto';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.resize = 'none';
    document.body.appendChild(clone);
    clone.value = element.value;

    const cloneHeight = clone.scrollHeight;
    element_container.style.height = cloneHeight + 23 + 'px';
    const delta_height = element_container.clientHeight - initial_height;

    
    if (delta_height !== 0) {
        
        element.setAttribute('rows', element.rows + (delta_height / 21));
        
    };

    document.body.removeChild(clone);

    return;

};