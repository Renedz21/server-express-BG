const PENDING_STATUS = 'pending'; //* 1 - Pendiente
const CONFIRMED_STATUS = 'confirmed'; //* 2 - Confirmado
const SHIPPED_STATUS = 'shipped'; //* 3 - Enviado
const DELIVERED_STATUS = 'delivered'; //* 4 - Entregado
const CANCELLED_STATUS = 'cancelled'; //* 5 - Cancelado

export const STATUS = {
    PENDING_STATUS,
    CONFIRMED_STATUS,
    SHIPPED_STATUS,
    DELIVERED_STATUS,
    CANCELLED_STATUS
}

const SUPERADMIN_ROLE = 'super-admin';
const ADMIN_ROLE = 'admin';
const CLIENT_ROLE = 'client';

export const ROLES = {
    SUPERADMIN_ROLE,
    ADMIN_ROLE,
    CLIENT_ROLE
}