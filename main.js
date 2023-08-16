
import { removeLoader, addLoader } from './src/components/loader';
import {usesStyles} from './src/components/styles';
import { addPurchase, kebabCase } from './src/utils';
import {createOrderItems} from './src/components/createOrderItem';
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}


function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="purchases ml-6 mr-6">
              <div class="bg-white px-4 py-3 gap-x-4 flex font-bold">
                  <button class="flex flex-1 text-center justify-center" id="sorting-button-1"> 
                      <span >Name</span>
                      <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-1"></i> 
                  </button>
                  <span class="flex-1">Nr tickets</span>
                  <span class="flex-1">Category</span>
                  <span class="flex-1 md: flex">Date</span>
                  <button class="md:flex text-center justify-center" id="sorting-button-2"> 
                      <span>Price</span>
                      <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-2"></i> 
                  </button>
                  <span class="w-28 sm: w-8"></span>
              </div>
              <div id="purchases-content">
              </div>
        </div>
      </div>
  `;
  }

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

let events = [];

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  addLoader();

  fetchTicketEvents().then((data) => {
    events = data;
    setTimeout(()=>{
      removeLoader();
    }, 1300);
    addEvents(events);
  });
  // // Sample hardcoded event data
  // const eventData = {
  //   id: 1,
  //   description: 'Word Capital of Night and Magic.',
  //   img: 'https://i.pinimg.com/564x/80/b8/d5/80b8d512df7325fce3d027bc0bb1118c.jpg',
  //   name: 'UNTOLD',
  //   date: 'October 1-4, 2023',
  //   price: '$150 - $300',
  //   ticketCategories: [
  //     { id: 1, description: 'General Admission' },
  //     { id: 2, description: 'VIP' },
  //   ],

  }


async function fetchTicketEvents(){
  const response = await fetch('http://localhost:8080/api/events');
  return await response.json();

}

async function getTicketCategories(){
  const response = await fetch('http://localhost:8080/api/ticketCategories');
  return await response.json();

}

async function fetchOrders(customerID){
  const response = await fetch(`http://localhost:8080/orders/getByUserID/${customerID}`);
 
  const data = await response.json();
  return data;
}

  const addEvents = (events) => {
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = 'No events';
    if(events.length) {
      eventsDiv.innerHTML = '';
      events.forEach(event => {
        eventsDiv.appendChild(createEvent(event));
      });
    }
  };

  const createEvent = (eventData) => {
    const title = kebabCase(eventData.eventName);

    const eventElement = createEventElement(eventData, title);
    return eventElement;
  };

  const createEventElement = (eventData, title) => {
    const {eventID, eventDescription, img, eventName, ticketCategory, startDate, endDate, venueDTO} = eventData;
    const eventDiv = document.createElement('div');
    const eventWrapperClasses = usesStyles('eventWrapper');
    const actionsWrapperClasses = usesStyles('actionsWrapper');
    const quantityClasses = usesStyles('quantity');
    const inputClasses = usesStyles('input');
    const quantityActionClasses = usesStyles('quantityAction');
    const increaseBtnClasses = usesStyles('increaseBtn');
    const decreaseBtnClasses = usesStyles('decreaseBtn');
    const addToCartBtnClasses = usesStyles('addToCartBtn');

    // Set up event wrapper
    eventDiv.classList.add(...eventWrapperClasses);

  // Format LocalDateTime values to DD/MM/YYYY
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB');
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-GB');

    // Create the event content markup
    const contentMarkup = `
    <header>
        <h2 class="event-title text=2xl font-bold">${eventName}</h2>
    </header>
    <div class="content">
      <img src="${getEventImageSrc(eventName)}" class="event-image w-full height-200 rounded"></img>
      <p class="description ">${eventDescription}</p>
      <p class="date text-gray-700 text-sm">Date: ${formattedStartDate} - ${formattedEndDate}</p>
      <p class="venue text-gray-700 text-sm">Location: ${venueDTO.location}</p>
    </div>
    `;
  eventDiv.innerHTML = contentMarkup;

  // create ticket type selection and quantity input
  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);

  const categoriesOptions = ticketCategory.map((category) =>
  `<option value=${category.ticketCategoryID}>${category.description}</option>`);
  console.log(categoriesOptions);


  const locationSection = createSectionWithIcon('./src/assets/stellar.jpg', `<p class="event-location ">${venueDTO.location}</p>`);

  const descSection = createSectionWithIcon('./src/assets/stellar.jpg', `<p class="event-description ">${eventDescription}</p>`);
  
  const ticketSection = createSectionWithIcon('./src/assets/stellar.jpg', `
    <select id="ticketType" name="ticketType" class="select ${title}-ticket-type text-sm bg-white border border-gray-300 rounded px-2 py-1 ">
      ${categoriesOptions.join('\n')}
    </select>
  `);

  const allSectionsMarkup = descSection + locationSection + ticketSection;
  actions.innerHTML = allSectionsMarkup;
  
  const ticketTypeMarkup = `
  <h2 class="text-lg font-bold mb-2 text-white-chooseTicket">Choose Ticket Type:</h2>
  <select id="ticketType" name="ticketType" class="${title}-ticket-type text-sm bg-white border border-gray-300 rounded px-2 py-1 ">
    ${categoriesOptions.join('\n')}
  </select>`;


      console.log(categoriesOptions);

  actions.innerHTML = ticketTypeMarkup;

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);

  const input = document.createElement('input');
  input.classList.add(...inputClasses);
  input.type = 'number';
  input.min = '0';
  input.value = '0';

  input.addEventListener('blur', () => 
  { 
    if (!input.value) {
    input.value = 0;
    }
    });


  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value); 
    if (currentQuantity > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
    });

    quantity.appendChild(input);

    const quantityActions = document.createElement('div');
    quantityActions.classList.add(...quantityActionClasses);

    const increase = document.createElement('button');
    increase.classList.add(...increaseBtnClasses);
    increase.innerText = '+';
    increase.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      const currentQuantity = parseInt(input.value);
      if(currentQuantity > 0) {
        addToCart.disabled = false;
      } else{
        addToCart.disabled = true;
      }
    });

    const decrease = document.createElement('button');
    decrease.classList.add(...decreaseBtnClasses);
    decrease.innerText = '-';
    decrease.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if(currentValue > 0) {
        input.value = currentValue -1;
      }
      const currentQuantity = parseInt(input.value);
      if(currentQuantity > 0) {
        addToCart.disabled = false;
      } else{
        addToCart.disabled = true;
      }
    });

    quantityActions.appendChild(increase); 
    quantityActions.appendChild(decrease);

    quantity.appendChild(quantityActions); 
    actions.appendChild(quantity); 
    eventDiv.appendChild(actions);

  // Create the event footer with "Add To Cart" button 
  const eventFooter = document.createElement('footer'); 
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartBtnClasses); 
  addToCart.innerText = 'Add To Cart'; 
  addToCart.disabled = true;

  addToCart.addEventListener('click', () => {
  handleAddToCart (title, eventID, input, addToCart);
});
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  return eventDiv;
    
  };

  function getEventImageSrc(eventName) {
    switch (eventName) {
      case 'Untold':
        return './src/assets/untold.jpg';
      case 'Electric Castle':
        return './src/assets/electriccastle.jpg';
      case 'Meci de Fotbal':
        return './src/assets/football.jpg';
      case 'Wine Festival':
        return './src/assets/wine.jpg';
      default:
        return './src/assets/wine.jpg'; 
    }
  }

  function createSectionWithIcon(iconSrc, content) {
    const imgIcon = document.createElement('img');
    imgIcon.src = iconSrc;
    imgIcon.alt = 'Icon';
    imgIcon.classList.add(...usesStyles('imgicon'));
    imgIcon.style.height = '25px';
    imgIcon.style.width = '25px';
  
    return `
      <div class="flex items-center">
        ${imgIcon.outerHTML}
        ${content}
      </div>
    `;
  }


const handleAddToCart = (title, eventID, input, addToCart) => {
  const ticketType = document.querySelector(`.${title}-ticket-type`).value;
  const quantity = input.value;
  if(parseInt(quantity)){
    const customerID = 2;
    addLoader();
    fetch(`http://localhost:8080/orders/${customerID}`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        ticketCategoryID:+ticketType,
        eventID: eventID,
        numberOfTickets:+quantity,

      })
    }).then((response)=>{
      return response.json().then((data)=>{
        if(!response.ok){
          console.log("Something went wrong...");
        }
        return data;
      })
    }).then((data)=>{
      addPurchase(data);
      console.log("Done!");
      input.value = 0;
      addToCart.disabled = true;
      toastr.success('Success!')
    })
      .catch(error => {
        console.log('mesaj specific');
        toastr.error('Error!')
      })
      .finally(() => {
        setTimeout(()=>{
        removeLoader();
      }, 1000);
    })

  }else{
    //Not integer. To be treated
  }
};

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const purchaseDiv = document.querySelector('.purchases');
  const purchaseContent = document.getElementById('purchases-content');
  addLoader();
  if(purchaseDiv) {
    
    fetchOrders(2).then((orders)=>{
      if(orders.length){
        setTimeout(()=>{
          removeLoader();
        }, 1000);
        orders.forEach((order)=>{
          const newOrder = createOrderItems(categories,order);
          purchaseContent.appendChild(newOrder);
        });
        purchaseDiv.appendChild(purchaseContent)
      }else removeLoader();
    })
  }
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    getTicketCategories().then((categories)=> {
      renderOrdersPage(categories);
    })
    .catch((error => {
      console.error('Error fetching ticket categories:', error);
    }))
  }
}



// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
