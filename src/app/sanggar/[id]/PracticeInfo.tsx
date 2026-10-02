import { Clock, MapPin } from "lucide-react";

/**
 * Practice schedule + venue of the studio's dance class. Shown in the "Kelas Tari" service's detail modal (or once
 * under the service cards for studios without a dance-class service), the single place they appear on the page.
 */
export default function PracticeInfo({
  info,
  isEn,
  className = "",
}: {
  info: { venue: string; schedule: string | null };
  isEn: boolean;
  className?: string;
}) {
  const rows = [
    info.schedule && { icon: Clock, label: isEn ? "Practice Schedule" : "Jadwal Latihan", value: info.schedule },
    { icon: MapPin, label: isEn ? "Practice Venue" : "Tempat Latihan", value: info.venue },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <dl className={`space-y-2.5 ${className}`}>
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-2.5">
          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-orange-600" aria-hidden="true" />
          <div className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</dt>
            <dd className="text-sm text-zinc-800 leading-relaxed">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
