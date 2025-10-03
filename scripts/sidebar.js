const sidebar = [{
    img: './Assets/images/sidebar-images/img-1.webp',
    name: 'Indian singer'
},
{
    img: './Assets/images/sidebar-images/img-2.webp',
    name: 'Bolywood singers'    
},{
    img: './Assets/images/sidebar-images/img-3.webp',
    name: 'Neeti Mohan '       
},{
    img: './Assets/images/sidebar-images/img-4.webp',
    name: 'Sonu Nigam'   
},{
    img: './Assets/images/sidebar-images/img-5.webp',
    name: 'Arijit Singh'   
},{
    img: './Assets/images/sidebar-images/img-6.webp',
    name: 'Deewana thera'   
},{
    img: './Assets/images/sidebar-images/img-7.webp',
    name: 'Jubin Nautiyal'   
},{
    img: './Assets/images/sidebar-images/img-8.jpeg',
    name: 'Monali Thakur Songs'   
},{
    img: './Assets/images/sidebar-images/img-9.jpeg',
    name: "Rose BLACKPINK's" 
},{
    img: './Assets/images/sidebar-images/img-10.jpeg',
    name: 'Shaan Singer'   
}];

const main__left_section = document.querySelector('.main__left_section');

sidebar.forEach((song) => {
    const main_left_section_singers_img = document.createElement('div');
    main_left_section_singers_img.className = 'main_left_section_singers_img';

    main_left_section_singers_img.innerHTML = `
        <img src="${song.img}" alt="${song.name}">
        <ul role="menu" class="dropdown_sidebar">
            <li role="itemmenu">${song.name}</li>
        </ul>
    `
    main__left_section.appendChild(main_left_section_singers_img);

    const dropdown = main_left_section_singers_img.querySelector('.dropdown_sidebar')

    main_left_section_singers_img.addEventListener('mouseenter',()=>{
        const rect =  main_left_section_singers_img.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.left = rect.right + 15 + 'px';
        dropdown.style.top = rect.top + 'px';
        dropdown.style.display = 'block';
    })
    main_left_section_singers_img.addEventListener('mouseleave',()=>{
    dropdown.style.display = 'none';
})
})

