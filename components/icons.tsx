import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Circle,
  CreditCardIcon as CardIcon,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Shield,
  ShieldCheck,
  Camera,
  Lock,
  Smartphone,
  Wifi,
  Bell,
  Home,
  Users,
  Package,
  BarChart3,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  ShoppingCart,
  Heart,
  Search,
  Menu,
  LogOut,
  UserCircle,
  Edit,
  Save,
  DeleteIcon as Cancel,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  ExternalLink,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Headphones,
  Wrench,
  Monitor,
  type LucideIcon,
  type LucideProps,
} from "lucide-react"
export type Icon = LucideIcon

export const Icons = {
  logo: Shield,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CardIcon,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  check: Check,
  circle: Circle,

  // Security & Home specific icons
  shield: Shield,
  shieldCheck: ShieldCheck,
  camera: Camera,
  lock: Lock,
  smartphone: Smartphone,
  wifi: Wifi,
  bell: Bell,
  home: Home,
  users: Users,
  package: Package,
  barChart: BarChart3,
  eye: Eye,
  eyeOff: EyeOff,

  // Contact & Communication
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  clock: Clock,

  // E-commerce
  star: Star,
  cart: ShoppingCart,
  heart: Heart,
  search: Search,
  menu: Menu,

  // User actions
  logout: LogOut,
  userCircle: UserCircle,
  edit: Edit,
  save: Save,
  cancel: Cancel,
  download: Download,
  upload: Upload,

  // Data & Analytics
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  calendar: Calendar,
  dollarSign: DollarSign,
  trendingUp: TrendingUp,

  // Features & Benefits
  award: Award,
  zap: Zap,
  globe: Globe,
  truck: Truck,
  card: CardIcon,
  headphones: Headphones,
  wrench: Wrench,
  monitor: Monitor,

  // Social Media
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,

  // Status & Feedback
  externalLink: ExternalLink,
  info: Info,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alertCircle: AlertCircle,

  // Custom brand icons
  gitHub: Github,
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
      />
    </svg>
  ),

  // Security system specific
  doorSensor: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15.5c-1.5-1.5-4-1.5-5.5 0" />
      <path d="M21 19.5c-3-3-8-3-11 0" />
    </svg>
  ),

  motionSensor: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.16-.21 2.31-.48 3.43-.82" />
      <path d="M22 12c0-1.66-.45-3.22-1.24-4.56" />
      <path d="M19.76 7.44A9.94 9.94 0 0 0 12 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  smartLock: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <circle cx="12" cy="16" r="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M12 13v3" />
    </svg>
  ),
}
