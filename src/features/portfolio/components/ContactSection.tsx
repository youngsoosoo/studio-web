import type { Contact } from '../types';
import { CopyButton } from './CopyButton';
import { SocialLinks } from './SocialLinks';

interface ContactSectionProps {
  contact: Contact;
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <div>
      {contact.availability ? (
        <p className="text-base text-slate-600">{contact.availability}</p>
      ) : null}

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Email</dt>
          <dd className="mt-1">
            <CopyButton
              value={contact.email}
              ariaLabel={`이메일 주소 복사: ${contact.email}`}
              className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              {contact.email}
            </CopyButton>
          </dd>
        </div>
        {contact.phone ? (
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Phone</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{contact.phone}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Location</dt>
          <dd className="mt-1 text-sm font-medium text-slate-900">{contact.location}</dd>
        </div>
      </dl>

      {contact.socials.length > 0 ? (
        <div className="mt-6">
          <SocialLinks socials={contact.socials} variant="chip" />
        </div>
      ) : null}
    </div>
  );
}
