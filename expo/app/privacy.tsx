import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';

export default function PrivacyScreen() {
  return (
    <View style={styles.container} testID="privacy-screen">
      <Stack.Screen options={{ title: 'Privacy Policy', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroIcon}>
          <Shield size={32} color="#0891B2" />
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: April 17, 2026</Text>

        <Text style={styles.lead}>
          Your privacy matters to us. This policy explains what information we collect, how we use it,
          and the choices you have. By using JumpStart SXM, you agree to the practices described below.
        </Text>

        <Section title="1. Information We Collect">
          <Bullet>Account info: name, email, phone number, and profile photo (optional).</Bullet>
          <Bullet>Provider info: business details, ID/passport, business license/work permit, and service categories (only if you register as a provider).</Bullet>
          <Bullet>Booking info: services you request, schedules, and messages with providers.</Bullet>
          <Bullet>Device info: device type, operating system, and app version for diagnostics.</Bullet>
          <Bullet>Approximate location (only when you grant permission) to show nearby services.</Bullet>
        </Section>

        <Section title="2. How We Use Your Information">
          <Bullet>To create and manage your account.</Bullet>
          <Bullet>To connect customers with service providers and process bookings.</Bullet>
          <Bullet>To verify provider identity and eligibility.</Bullet>
          <Bullet>To send important notifications about your account or bookings.</Bullet>
          <Bullet>To improve the app, fix bugs, and prevent fraud or abuse.</Bullet>
        </Section>

        <Section title="3. Sharing Your Information">
          <Paragraph>
            We share limited information with service providers when you make a booking (e.g., your name,
            contact info, and booking details). We do not sell your personal information. We may share data
            with trusted service providers who help us run the app (hosting, analytics) under strict
            confidentiality agreements, or when required by law.
          </Paragraph>
        </Section>

        <Section title="4. Data Storage & Security">
          <Paragraph>
            Your data is stored securely using industry-standard encryption in transit and at rest.
            Sensitive documents (ID, business license) are accessible only to authorized reviewers.
            While we work hard to protect your information, no system is 100% secure.
          </Paragraph>
        </Section>

        <Section title="5. Offline Mode">
          <Paragraph>
            JumpStart SXM works offline. Some data (services, bookings, and your profile) is cached on
            your device so you can use the app without a connection. Cached data stays on your device and
            syncs with our servers when you go back online.
          </Paragraph>
        </Section>

        <Section title="6. Your Rights & Choices">
          <Bullet>Access, correct, or update your information at any time from your profile.</Bullet>
          <Bullet>Disable notifications from the Notifications section.</Bullet>
          <Bullet>Request a copy or deletion of your data (see Section 8).</Bullet>
          <Bullet>Withdraw permissions like location at any time in your device settings.</Bullet>
        </Section>

        <Section title="7. Children's Privacy">
          <Paragraph>
            JumpStart SXM is not intended for children under 13. We do not knowingly collect personal
            information from children. If you believe a child has provided us with personal data, please
            contact us so we can remove it.
          </Paragraph>
        </Section>

        <Section title="8. Account & Data Deletion">
          <Paragraph>
            You can request the permanent deletion of your account and all associated data at any time
            from the Profile screen. Requests are processed within 30 days. You can also email
            privacy@jumpstartsxm.com.
          </Paragraph>
        </Section>

        <Section title="9. Changes to This Policy">
          <Paragraph>
            We may update this policy from time to time. Significant changes will be communicated through
            the app. Continued use of JumpStart SXM after changes means you accept the updated policy.
          </Paragraph>
        </Section>

        <Section title="10. Contact Us">
          <Paragraph>
            Questions or concerns? Email us at privacy@jumpstartsxm.com. We're based in Sint Maarten and
            aim to respond within 5 business days.
          </Paragraph>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>JumpStart SXM</Text>
          <Text style={styles.footerSub}>Sint Maarten</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 60 },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  updated: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 16 },
  lead: { fontSize: 15, color: '#334155', lineHeight: 22, marginBottom: 8 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  paragraph: { fontSize: 14, color: '#475569', lineHeight: 21 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0891B2',
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 21 },
  footer: { alignItems: 'center', marginTop: 28 },
  footerText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  footerSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
});
