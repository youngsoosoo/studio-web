import type { Certification } from '../types';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <ul className="space-y-3">
      {certifications.map((cert) => (
        <li
          key={cert.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <h3 className="text-base font-semibold text-slate-900">{cert.name}</h3>
            <p className="mt-0.5 text-sm text-slate-600">{cert.issuer}</p>
            {cert.credentialId ? (
              <p className="mt-0.5 text-xs text-slate-400">자격번호 {cert.credentialId}</p>
            ) : null}
          </div>
          <p className="text-sm text-slate-500">{cert.date}</p>
        </li>
      ))}
    </ul>
  );
}
