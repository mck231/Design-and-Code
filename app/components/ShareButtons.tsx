// app/components/ShareButtons.tsx
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Copy, Check } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ShareButtonsProps {
  event: {
    title: string;
    date: string;
    slug: string;
    topics: string[];
    summary: string;
  };
  variant?: 'compact' | 'full';
  className?: string;
}

export default function ShareButtons({ event, variant = 'full', className = '' }: ShareButtonsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
  const [eventUrl, setEventUrl] = useState('');
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number; right: number; bottom: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Set the URL on the client side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEventUrl(`${window.location.origin}/events/${event.slug}`);
    }
  }, [event.slug]);

  // Use a fallback URL for SSR
  const fallbackUrl = `https://memphisdesignandcode.com/events/${event.slug}`;
  const shareUrl = eventUrl || fallbackUrl;
  
  // Format date for sharing
  const formatDateForSharing = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
  };

  // Generate hashtags from topics + core hashtags
  const generateHashtags = (): string => {
    const coreHashtags = ['#DesignAndCode', '#MemphisTech', '#MemphisDesignAndCode'];
    const topicHashtags = event.topics
      .filter(topic => topic !== 'Events in Memphis, TN') // Exclude generic topic
      .map(topic => '#' + topic.replace(/[^a-zA-Z0-9]/g, '')) // Remove spaces and special chars
      .slice(0, 5); // Limit to 5 topic hashtags
    
    return [...coreHashtags, ...topicHashtags].join(' ');
  };

  // Generate share content
  const shareContent = {
    text: `I will be attending "${event.title}" on ${formatDateForSharing(event.date)}!\n\nJoin the Memphis tech community for this amazing event.\n\n${shareUrl}\n\n${generateHashtags()}`,
    shortText: `Join me at "${event.title}" on ${formatDateForSharing(event.date)}! ${shareUrl} ${generateHashtags()}`,
    emailSubject: `Join me at ${event.title}`,
    emailBody: `Hi!\n\nI wanted to share this awesome tech event happening in Memphis:\n\n"${event.title}"\nDate: ${formatDateForSharing(event.date)}\n\n${event.summary}\n\nEvent Details: ${shareUrl}\n\nHope to see you there!`
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Social media URLs
  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(event.title)}&summary=${encodeURIComponent(shareContent.text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.shortText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareContent.text)}`,
    email: `mailto:?subject=${encodeURIComponent(shareContent.emailSubject)}&body=${encodeURIComponent(shareContent.emailBody)}`
  };

  // Function to detect if dropdown should open above or below
  const detectDropdownPosition = () => {
    if (!buttonRef.current) return 'below';
    
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 280; // Approximate height of dropdown menu
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Store button position for portal
    setButtonPosition({
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    });
    
    // If not enough space below but enough space above, position above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      return 'above';
    }
    
    return 'below';
  };

  // Handle dropdown toggle with position detection
  const toggleDropdown = () => {
    if (!showDropdown) {
      // Detect position before showing dropdown
      const position = detectDropdownPosition();
      setDropdownPosition(position);
    }
    setShowDropdown(!showDropdown);
  };

  // Discord share function (copy formatted message)
  const shareToDiscord = async () => {
    const discordMessage = `🎯 **${event.title}**\n📅 ${formatDateForSharing(event.date)}\n\n${event.summary}\n\n🔗 ${shareUrl}\n\n${generateHashtags().replace(/#/g, '')}`;
    
    try {
      await navigator.clipboard.writeText(discordMessage);
      // You could show a toast notification here
      alert('Discord message copied to clipboard! Paste it in your Discord channel.');
    } catch (err) {
      console.error('Failed to copy Discord message:', err);
    }
  };

  const buttonBaseClass = "inline-flex items-center justify-center transition-all duration-200 hover:scale-105";
  const compactClass = "w-8 h-8 rounded-full text-sm";
  const fullClass = "px-3 py-2 rounded-lg text-sm font-medium";
  
  const buttonClass = variant === 'compact' ? compactClass : fullClass;

  // Portal dropdown component
  const DropdownPortal = () => {
    if (!showDropdown || !buttonPosition) return null;

    const dropdownStyle = {
      position: 'fixed' as const,
      left: buttonPosition.right - 192, // 192px = w-48
      top: dropdownPosition === 'above' 
        ? buttonPosition.top - 280 - 8 
        : buttonPosition.bottom + 8,
      zIndex: 50,
    };

    return createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
        
        {/* Dropdown */}
        <div style={dropdownStyle} className="w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-2">
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <i className="bi bi-linkedin w-4 h-4 text-blue-600"></i>
              LinkedIn
            </a>

            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <i className="bi bi-twitter-x w-4 h-4 text-black dark:text-white"></i>
              X (Twitter)
            </a>

            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <i className="bi bi-facebook w-4 h-4 text-blue-700"></i>
              Facebook
            </a>

            <button
              onClick={() => {
                shareToDiscord();
                setShowDropdown(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
            >
              <i className="bi bi-discord w-4 h-4 text-indigo-600"></i>
              Discord
            </button>

            <a
              href={shareUrls.email}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <i className="bi bi-envelope w-4 h-4 text-gray-600 dark:text-gray-400"></i>
              Email
            </a>

            <div className="border-t border-gray-200 dark:border-gray-600 my-1" />

            <button
              onClick={() => {
                copyToClipboard();
                setShowDropdown(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </>,
      document.body
    );
  };

  if (variant === 'compact') {
    return (
      <>
        <div className={`relative ${className}`}>
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            title="Share this event"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <DropdownPortal />
      </>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        Share This Event
      </h3>
      
      <div className="flex flex-wrap gap-3">
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClass} ${buttonClass} bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg`}
        >
          <i className="bi bi-linkedin w-4 h-4 mr-2"></i>
          LinkedIn
        </a>

        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClass} ${buttonClass} bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg`}
        >
          <i className="bi bi-twitter-x w-4 h-4 mr-2"></i>
          X (Twitter)
        </a>

        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClass} ${buttonClass} bg-blue-700 hover:bg-blue-800 text-white shadow-md hover:shadow-lg`}
        >
          <i className="bi bi-facebook w-4 h-4 mr-2"></i>
          Facebook
        </a>

        <button
          onClick={shareToDiscord}
          className={`${buttonBaseClass} ${buttonClass} bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg`}
        >
          <i className="bi bi-discord w-4 h-4 mr-2"></i>
          Discord
        </button>

        <a
          href={shareUrls.email}
          className={`${buttonBaseClass} ${buttonClass} bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg`}
        >
          <i className="bi bi-envelope w-4 h-4 mr-2"></i>
          Email
        </a>

        <button
          onClick={copyToClipboard}
          className={`${buttonBaseClass} ${buttonClass} bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg`}
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
