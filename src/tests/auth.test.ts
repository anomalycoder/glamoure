import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';
import { db } from '../database/db';

describe('Glamouré Authentication System', () => {
  const testEmail = `test.user.${Date.now()}@glamoure-luxury.com`;
  const testPassword = 'Password123!';

  it('should register a new customer account successfully', async () => {
    const session = await AuthService.register({
      email: testEmail,
      password: testPassword,
      fullName: 'Genevieve Laurent',
      phone: '+1 555 234 5678',
      role: 'customer',
    });

    expect(session).toBeDefined();
    expect(session.user.email).toBe(testEmail.toLowerCase());
    expect(session.user.fullName).toBe('Genevieve Laurent');
    expect(session.activeRole).toBe('customer');
    expect(session.token).toBeDefined();
  });

  it('should prevent duplicate registration with the same email', async () => {
    await expect(
      AuthService.register({
        email: testEmail,
        password: 'AnotherPassword456!',
        fullName: 'Genevieve Impostor',
      })
    ).rejects.toThrow('An account with this email address already exists.');
  });

  it('should reject passwords shorter than 6 characters', async () => {
    await expect(
      AuthService.register({
        email: `short.${Date.now()}@glamoure.com`,
        password: '123',
        fullName: 'Short Pass',
      })
    ).rejects.toThrow('Password must be at least 6 characters long.');
  });

  it('should authenticate valid credentials and issue a valid session', async () => {
    const session = await AuthService.login(testEmail, testPassword);
    expect(session).toBeDefined();
    expect(session.user.email).toBe(testEmail.toLowerCase());
    expect(session.activeRole).toBe('customer');
  });

  it('should reject invalid passwords', async () => {
    await expect(
      AuthService.login(testEmail, 'WrongPassword999')
    ).rejects.toThrow('Invalid email or password.');
  });

  it('should reject non-existent user accounts', async () => {
    await expect(
      AuthService.login('ghost.user@nonexistent.com', 'SomePassword')
    ).rejects.toThrow('Invalid email or password.');
  });

  it('should register a salon owner and provision business salon record', async () => {
    const ownerEmail = `owner.${Date.now()}@haute-coiffure.com`;
    const session = await AuthService.register({
      email: ownerEmail,
      password: 'DirectorPassword123!',
      fullName: 'Madame Jacqueline',
      role: 'salon_owner',
      salonName: 'Jacqueline Haute Coiffure',
    });

    expect(session.activeRole).toBe('salon_owner');
    expect(session.salonId).toBeDefined();

    const createdSalon = db.getSalonById(session.salonId!);
    expect(createdSalon).toBeDefined();
    expect(createdSalon?.name).toBe('Jacqueline Haute Coiffure');
  });

  it('should support multi-role switching for unified identity', async () => {
    // Elena Vance (seed owner) has memberships
    const elenaUser = db.findUserByEmail('owner@glamoure.com');
    expect(elenaUser).toBeDefined();

    const initialSession = await AuthService.login('owner@glamoure.com', 'glamoure2026');
    expect(initialSession.activeRole).toBe('salon_owner');

    // Switch role to customer
    const switchedSession = AuthService.switchRole(initialSession, 'customer');
    expect(switchedSession.activeRole).toBe('customer');
  });

  it('should block login for deactivated accounts', async () => {
    const deactEmail = `deactivated.${Date.now()}@glamoure.com`;
    const regSession = await AuthService.register({
      email: deactEmail,
      password: 'SafePassword123!',
      fullName: 'Deactivated User',
      role: 'customer',
    });

    // Deactivate user in database
    db.updateUser(regSession.user.id, { isActive: false });

    await expect(
      AuthService.login(deactEmail, 'SafePassword123!')
    ).rejects.toThrow('This account has been deactivated. Please contact concierge support.');
  });
});
