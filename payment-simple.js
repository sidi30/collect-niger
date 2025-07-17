// URL directe vers la page de paiement HelloAsso
const HELLOASSO_PAYMENT_URL = 'https://www.helloasso.com/associations/association-des-nigeriens-et-amis-grand-nord-france/formulaires/16';

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document chargé, initialisation des gestionnaires d\'événements');
    
    // Attacher l'événement au bouton de paiement
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        console.log('Bouton de paiement trouvé, ajout du gestionnaire');
        checkoutButton.addEventListener('click', openPaymentModal);
    } else {
        console.error('Bouton de paiement non trouvé');
    }
    
    // Gérer les clics sur le bouton de fermeture de la modale
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closePaymentModal);
    });
    
    // Gérer le bouton de redirection dans la modale
    const redirectButton = document.getElementById('payment-redirect');
    if (redirectButton) {
        redirectButton.addEventListener('click', redirectToHelloAsso);
    }
});

// Ouvrir la modale de paiement
function openPaymentModal() {
    console.log('Ouverture de la modale de paiement');
    
    const paymentModal = document.getElementById('payment-modal');
    const overlay = document.getElementById('overlay') || document.getElementById('modal-overlay');
    
    if (paymentModal && overlay) {
        // Afficher la modale et l'overlay
        paymentModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Préparer la modale pour l'affichage
        const loadingSection = document.getElementById('payment-loading');
        const formSection = document.getElementById('payment-form');
        const successSection = document.getElementById('payment-success');
        
        if (loadingSection) loadingSection.style.display = 'none';
        if (formSection) formSection.style.display = 'block';
        if (successSection) successSection.style.display = 'none';
        
        // Récupérer le montant du panier depuis localStorage ou depuis l'élément cart-total
        const paymentTotal = document.getElementById('payment-total');
        const cartTotal = document.getElementById('cart-total');
        
        if (paymentTotal) {
            // Essayer de récupérer le montant directement du panier affiché
            if (cartTotal) {
                paymentTotal.textContent = cartTotal.textContent;
                console.log('Montant récupéré du panier: ' + cartTotal.textContent);
            } else {
                // Si on ne trouve pas l'élément cart-total, essayer localStorage
                try {
                    // Tenter de récupérer le panier de localStorage
                    const cartData = localStorage.getItem('cart');
                    if (cartData) {
                        const cart = JSON.parse(cartData);
                        // Calculer le total
                        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                        paymentTotal.textContent = total.toFixed(2) + '€';
                        console.log('Montant calculé depuis localStorage: ' + total.toFixed(2) + '€');
                    } else {
                        // Fallback sur le montant visible dans l'interface
                        const totalElem = document.querySelector('.total-amount');
                        if (totalElem) {
                            paymentTotal.textContent = totalElem.textContent;
                            console.log('Montant récupéré de l\'interface: ' + totalElem.textContent);
                        } else {
                            // Dernier recours: utiliser la valeur de l'élément checkout-button
                            const checkoutButton = document.getElementById('checkout-button');
                            if (checkoutButton && checkoutButton.dataset.amount) {
                                paymentTotal.textContent = parseFloat(checkoutButton.dataset.amount).toFixed(2) + '€';
                                console.log('Montant récupéré du bouton: ' + checkoutButton.dataset.amount);
                            } else {
                                // Fallback final sur un montant par défaut
                                paymentTotal.textContent = '0.00€';
                                console.log('Montant par défaut utilisé');
                            }
                        }
                    }
                } catch (e) {
                    console.error('Erreur lors de la récupération du montant:', e);
                    paymentTotal.textContent = '0.00€';
                }
            }
        }
    } else {
        console.error('Éléments de la modale non trouvés');
    }
}

// Fermer la modale de paiement
function closePaymentModal() {
    console.log('Fermeture de la modale de paiement');
    
    const paymentModal = document.getElementById('payment-modal');
    const overlay = document.getElementById('overlay') || document.getElementById('modal-overlay');
    
    if (paymentModal) paymentModal.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
    
    document.body.style.overflow = 'auto';
}

// Rediriger vers HelloAsso avec le montant
function redirectToHelloAsso() {
    console.log('Redirection vers HelloAsso');
    
    // Récupérer le montant affiché (ou utiliser un montant par défaut)
    const paymentTotal = document.getElementById('payment-total');
    let amount = 3000; // 30.00€ en centimes par défaut
    
    if (paymentTotal) {
        const amountText = paymentTotal.textContent.replace('€', '').trim();
        amount = Math.round(parseFloat(amountText) * 100);
    }
    
    // Rediriger vers HelloAsso avec le montant
    const finalUrl = `${HELLOASSO_PAYMENT_URL}?amount=${amount}`;
    console.log(`Redirection vers: ${finalUrl}`);
    window.location.href = finalUrl;
}
