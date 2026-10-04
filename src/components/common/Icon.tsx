import {
  BadgeCheck,
  Calendar,
  Camera,
  Car,
  Compass,
  Headset,
  Heart,
  Hotel,
  Landmark,
  Map,
  Mountain,
  Plane,
  Shield,
  Ship,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  TreePine,
  Users,
  Utensils,
  Wallet,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { z } from "zod";
import type { iconNameSchema } from "@/content/schemas";

export type IconName = z.infer<typeof iconNameSchema>;

const ICONS: Record<IconName, LucideIcon> = {
  shield: Shield,
  headset: Headset,
  wallet: Wallet,
  map: Map,
  hotel: Hotel,
  car: Car,
  plane: Plane,
  camera: Camera,
  mountain: Mountain,
  waves: Waves,
  sun: Sun,
  snowflake: Snowflake,
  utensils: Utensils,
  heart: Heart,
  star: Star,
  users: Users,
  compass: Compass,
  landmark: Landmark,
  ship: Ship,
  sparkles: Sparkles,
  tree: TreePine,
  shopping: ShoppingBag,
  calendar: Calendar,
  badge: BadgeCheck,
};

/** Renders an icon chosen by name in content JSON (names are validated by iconNameSchema). */
export function Icon({ name, className, strokeWidth = 1.75 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const Component = ICONS[name];
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
