import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/helpers";
import { initialOrders } from "../data/orders";
import { initialRestaurants } from "../data/restaurants";
import { initialPartners } from "../data/deliveryPartners";
import { initialCustomers } from "../data/customers";
import { initialTransactions } from "../data/payments";
import { initialOffers } from "../data/offers";
import { initialTickets } from "../data/tickets";

const AdminDataContext = createContext();
export const useAdminData = () => useContext(AdminDataContext);

export const AdminDataProvider = ({ children }) => {
  const [orders, setOrders] = useState(() =>
    loadFromStorage("admin_orders", initialOrders)
  );
  const [restaurants, setRestaurants] = useState(() =>
    loadFromStorage("admin_restaurants", initialRestaurants)
  );
  const [partners, setPartners] = useState(() =>
    loadFromStorage("admin_partners", initialPartners)
  );
  const [customers, setCustomers] = useState(() =>
    loadFromStorage("admin_customers", initialCustomers)
  );
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage("admin_transactions", initialTransactions)
  );
  const [offers, setOffers] = useState(() =>
    loadFromStorage("admin_offers", initialOffers)
  );
  const [tickets, setTickets] = useState(() =>
    loadFromStorage("admin_tickets", initialTickets)
  );
  const [activityLog, setActivityLog] = useState(() =>
    loadFromStorage("admin_activity", [])
  );

  // Persist all changes
  useEffect(() => saveToStorage("admin_orders", orders), [orders]);
  useEffect(() => saveToStorage("admin_restaurants", restaurants), [restaurants]);
  useEffect(() => saveToStorage("admin_partners", partners), [partners]);
  useEffect(() => saveToStorage("admin_customers", customers), [customers]);
  useEffect(() => saveToStorage("admin_transactions", transactions), [transactions]);
  useEffect(() => saveToStorage("admin_offers", offers), [offers]);
  useEffect(() => saveToStorage("admin_tickets", tickets), [tickets]);
  useEffect(() => saveToStorage("admin_activity", activityLog), [activityLog]);

  // Helper to log activity
  const logActivity = (action, meta = "") => {
    setActivityLog((prev) =>
      [
        {
          id: Date.now(),
          action,
          meta,
          at: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 100)
    );
  };

  // ─── Orders ───
  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    logActivity(`Order ${id} → ${status}`);
  };
  const approveRefund = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, refundStatus: "approved" } : o))
    );
    logActivity(`Refund approved for ${id}`);
  };
  const rejectRefund = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, refundStatus: "rejected" } : o))
    );
    logActivity(`Refund rejected for ${id}`);
  };

  // ─── Restaurants ───
  const approveRestaurant = (id) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "active" } : r))
    );
    logActivity(`Restaurant ${id} approved`);
  };
  const rejectRestaurant = (id) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    logActivity(`Restaurant ${id} rejected`);
  };
  const toggleRestaurantStatus = (id) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      )
    );
    logActivity(`Restaurant ${id} status toggled`);
  };

  // ─── Delivery Partners ───
  const verifyPartner = (id) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verified: true } : p))
    );
    logActivity(`Partner ${id} verified`);
  };
  const togglePartnerOnline = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, online: !p.online } : p
      )
    );
    logActivity(`Partner ${id} online status toggled`);
  };

  // ─── Customers ───
  const toggleCustomerBlock = (id) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "blocked" : "active" }
          : c
      )
    );
    logActivity(`Customer ${id} block toggled`);
  };

  // ─── Offers ───
  const addOffer = (offer) => {
    setOffers((prev) => [{ ...offer, id: Date.now() }, ...prev]);
    logActivity(`Offer ${offer.code} created`);
  };
  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    logActivity(`Offer ${id} deleted`);
  };
  const toggleOffer = (id) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: o.status === "active" ? "paused" : "active" }
          : o
      )
    );
    logActivity(`Offer ${id} toggled`);
  };

  // ─── Tickets ───
  const updateTicketStatus = (id, status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    logActivity(`Ticket ${id} → ${status}`);
  };

  return (
    <AdminDataContext.Provider
      value={{
        orders,
        restaurants,
        partners,
        customers,
        transactions,
        offers,
        tickets,
        activityLog,
        updateOrderStatus,
        approveRefund,
        rejectRefund,
        approveRestaurant,
        rejectRestaurant,
        toggleRestaurantStatus,
        verifyPartner,
        togglePartnerOnline,
        toggleCustomerBlock,
        addOffer,
        deleteOffer,
        toggleOffer,
        updateTicketStatus,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};