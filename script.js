/* Nav for mobile */
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

/* Product Small Image Handler */
document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".prodetails-section");
    if (!section) return;

    const mainImage = section.querySelector("#main-image");
    const smallImages = section.querySelectorAll(".small-image");
    const columns = section.querySelectorAll(".small-image-column");

    smallImages.forEach((img) => {
        img.parentElement.addEventListener("click", function() {
            columns.forEach(col => col.classList.remove("active"));
            this.classList.add("active");

            setTimeout(() => {
                mainImage.src = img.src;
            }, 130);
        });
    });
});

/* Toasts */
function showToast(message, type = 'success') {
    const container = document.getElementById("toast-container");
    if (!container) return; 
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <i class="fas fa-times toast-close"></i>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.style.animation = 'slideOut 0.4s ease forwards';
        toast.addEventListener('animationend', () => toast.remove());
    });
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.4s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }
    }, 3500);
}

/* Shoping Cart */
document.addEventListener("DOMContentLoaded", () => {
    const addCartButtons = document.querySelectorAll(".add-cart");

    addCartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const product = button.closest(".pro");
            const item = {
                name: product.dataset.name,
                price: product.dataset.price,
                image: product.dataset.image,
                quantity: 1
            };

            addToCart(item);
        });
    });
});

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(product => product.name === item.name && product.image === item.image);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    

    showToast(`${item.name} added to cart!`, 'success');
}

function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total");
    

    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryTotal = document.getElementById("summary-total");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        if (totalContainer) totalContainer.innerText = "0.00";
        if (summarySubtotal) summarySubtotal.innerText = "0.00";
        if (summaryTotal) summaryTotal.innerText = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML += `
            <div class="cart-box">
                <img src="${item.image}" alt="">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>₱${parseFloat(item.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
            `;
        }
    });

    // Write calculations to strings with fixed decimal precision (e.g. 1250.00)
    const formattedTotal = total.toFixed(2);
    
    if (totalContainer) totalContainer.innerText = formattedTotal;
    if (summarySubtotal) summarySubtotal.innerText = formattedTotal;
    if (summaryTotal) summaryTotal.innerText = formattedTotal;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemName = cart[index].name;

    const modal = document.getElementById("confirm-modal");
    const message = document.getElementById("confirm-modal-message");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const confirmBtn = document.getElementById("modal-confirm-btn");

    if (!modal) {
      
        
        
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
        showToast("Item removed from cart.", 'error');
        return;
    }

    message.innerText = `Are you sure you want to remove "${itemName}" from your cart?`;
    modal.classList.add("show");

    const closeModal = () => { modal.classList.remove("show"); };
    cancelBtn.onclick = () => { closeModal(); };

    confirmBtn.onclick = () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
        closeModal();
        showToast(`Removed ${itemName} from cart.`, 'error');
    };
}

function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = parseInt(quantity) || 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

/* Single Product Page */
document.addEventListener("DOMContentLoaded", () => {
    const sizeSelect = document.getElementById("size-select");
    const priceDisplay = document.querySelector(".single-pro-details h2");
    const addToCartBtn = document.getElementById("single-add-btn");
    const quantityInput = document.getElementById("product-quantity");
    const currentMainImage = document.getElementById("main-image");

    if (sizeSelect && priceDisplay && addToCartBtn) {
        sizeSelect.addEventListener("change", () => {
            const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
            const newPrice = selectedOption.dataset.price;
            priceDisplay.innerText = `₱${newPrice}.00`;
            addToCartBtn.dataset.price = newPrice;
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
            const chosenSize = selectedOption ? selectedOption.value : "Standard";
            const chosenPrice = parseFloat(addToCartBtn.dataset.price);

            const item = {
                name: `${addToCartBtn.dataset.name} (${chosenSize})`,
                price: chosenPrice,
                image: currentMainImage ? currentMainImage.getAttribute("src") : addToCartBtn.dataset.image,
                quantity: parseInt(quantityInput.value) || 1
            };

            addToCart(item);
        });
    }
});


// Filterboxes
document.addEventListener("DOMContentLoaded", () => {
    const filterBoxes = document.querySelectorAll(".filter-box");
    const products = document.querySelectorAll("#product1 .pro");
    if (filterBoxes.length === 0 || products.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);

    const applyFilter = (filter) => {
        filterBoxes.forEach(b => b.classList.toggle("active", b.getAttribute("data-target") === filter));
        products.forEach(p => p.style.display = (filter === "all" || p.classList.contains(filter)) ? "block" : "none");
        const url = filter === "all" ? "shop.html" : `shop.html?filter=${filter}`;
        window.history.replaceState({}, '', url); 
    };

    applyFilter(urlParams.get('filter') || "all");
    filterBoxes.forEach(box => box.addEventListener("click", () => applyFilter(box.getAttribute("data-target"))));
});

// Newsletter Subscription 
document.addEventListener("DOMContentLoaded", () => {
    const newsletterBtn = document.getElementById("newsletter-btn");
    const newsletterInput = document.getElementById("newsletter-input");

    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener("click", () => {
            const emailValue = newsletterInput.value.trim();
            if (emailValue === "") {
                showToast("Please enter a valid email address!", 'error');
            } else {
                showToast("Email submitted successfully!", 'success');
                newsletterInput.value = ""; 
            }
        });
    }
});

// Contact Submission Form 
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const contactName = document.getElementById("contact-name");

    if (contactForm && contactName) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameValue = contactName.value.trim();
            showToast(`Thank you, ${nameValue}! Your message has been sent.`, 'success');
            contactForm.reset();
        });
    }
});

// Cart Checkout Trigger 
document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkout-trigger");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                showToast("Your cart is empty! Add some items before checking out.", 'error');
            } else {
                showToast("Proceeding to secure payment processing environment...", 'success');
            }
        });
    }
});

// Coupon Code Handler
document.addEventListener("DOMContentLoaded", () => {
    const couponBtn = document.querySelector("#coupon .normal-btn");
    const couponInput = document.querySelector("#coupon input");

    if (couponBtn && couponInput) {
        couponBtn.addEventListener("click", () => {
            const code = couponInput.value.trim();
            if (code === "") {
                showToast("Please enter a coupon code before applying.", 'error');
            } else {
                showToast(`Coupon "${code.toUpperCase()}" applied successfully! Calculating your discount...`, 'success');
                couponInput.value = "";
            }
        });
    }
});