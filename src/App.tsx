import QrScanner from "qr-scanner";
import * as QRCode from "qrcode";
import React, { useEffect, useMemo, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Share2,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";

// React Icons examples (uncomment to use):
// import { FaHome, FaUser, FaCog } from 'react-icons/fa';
// import { MdEmail, MdPhone } from 'react-icons/md';
// import { IoMdSettings } from 'react-icons/io';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// PWA Installer Component
const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Check if user has already dismissed the prompt recently
    const lastDismissed = localStorage.getItem("pwa-install-dismissed");
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    if (lastDismissed && parseInt(lastDismissed) > oneDayAgo) {
      return; // Don't show if dismissed within last 24 hours
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show our custom install prompt after a short delay
      setTimeout(() => {
        if (!standalone) {
          setShowInstallPrompt(true);
        }
      }, 2000); // Show after 2 seconds
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show prompt if not in standalone mode
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // For Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
      setShowInstallPrompt(false);
    } else if (isIOS) {
      // For iOS, we can't trigger install programmatically
      // The prompt will show instructions
      return;
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showInstallPrompt || isStandalone) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <div className="modal-content bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Install Gulu Inventory
          </h2>
          <button
            onClick={handleDismiss}
            className="close-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>

          <p className="text-gray-600 mb-6">
            Get quick access to your grocery lists. Install our app for a better
            experience!
          </p>

          {isIOS ? (
            <div className="text-left mb-6">
              <p className="text-sm text-gray-700 mb-3">
                To install this app on your iPhone:
              </p>
              <ol className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <span>
                    Tap the <strong>Share</strong> button at the bottom of
                    Safari
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <span>
                    Tap <strong>"Add"</strong> to confirm
                  </span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="flex gap-3 mb-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Download size={16} />
                Install App
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              {isIOS ? "Got it!" : "Maybe Later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  quantity: number;
  isCompleted: boolean;
  isOutOfStock: boolean;
  imageUrl?: string;
  comment?: string;
  category?: string;
  completedAt?: Date;
}

interface RestockList {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastViewedAt?: Date;
  products: Product[];
  source?: string; // "Manual Entry" or "Imported from Code" or "Imported from CSV"
}

// QR Scanner Modal Component
interface QrScannerModalProps {
  onQrCodeDetected: (code: string) => void;
  onClose: () => void;
}

const QrScannerModal: React.FC<QrScannerModalProps> = ({
  onQrCodeDetected,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        setIsScanning(true);
        setError("");

        // Create QR Scanner instance
        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            if (result?.data) {
              onQrCodeDetected(result.data);
              cleanup();
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        );

        scannerRef.current = qrScanner;

        // Start scanning
        await qrScanner.start();
      } catch (error) {
        console.error("Failed to start QR scanner:", error);
        setError(
          "Unable to access camera. Please check permissions and try again."
        );
        setIsScanning(false);
      }
    };

    const cleanup = () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      setIsScanning(false);
    };

    startScanner();

    // Cleanup on unmount
    return cleanup;
  }, [onQrCodeDetected]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="close-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <div className="text-6xl opacity-50 mb-2">📷</div>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={handleClose}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                        Point camera at QR code
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-gray-600 text-sm">
                Position the QR code within the camera view to scan
                automatically.
              </p>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GuluInventoryApp() {
  const [lists, setLists] = useState<RestockList[]>(() => {
    const saved = localStorage.getItem("gulu-lists");
    return saved
      ? JSON.parse(saved).map((l: any) => ({
          ...l,
          createdAt: new Date(l.createdAt),
          lastViewedAt: l.lastViewedAt ? new Date(l.lastViewedAt) : undefined,
          products: l.products.map((p: any) => ({
            ...p,
            completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
          })),
        }))
      : [
          {
            id: "1",
            name: "Toast",
            description: "Basic toast items",
            createdAt: new Date("2025-07-30"),
            source: "Manual Entry",
            products: [],
          },
          {
            id: "2",
            name: "Sparkling Water",
            description: "Imported from Shopify on 10/26/23",
            createdAt: new Date("2025-07-23"),
            source: "Imported from Shopify",
            products: [
              {
                id: "2-1",
                name: "Blackberry Tange...",
                quantity: 4,
                isCompleted: true,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1581635439309-ab4edce0c040?w=300&h=300&fit=crop",
              },
              {
                id: "2-2",
                name: "Blueberry Nectar...",
                quantity: 4,
                isCompleted: true,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
              {
                id: "2-3",
                name: "Cherry Lime",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
              {
                id: "2-4",
                name: "Pomegranate",
                quantity: 0,
                isCompleted: false,
                isOutOfStock: false,
                category: "Beverages",
                imageUrl:
                  "https://images.unsplash.com/photo-1560458675-fc20e3b8a1e2?w=300&h=300&fit=crop",
              },
            ],
          },
          {
            id: "3",
            name: "Organic Snacks",
            description: "Manual Entry",
            createdAt: new Date("2025-07-22"),
            source: "Manual Entry",
            products: Array.from({ length: 15 }, (_, i) => ({
              id: `3-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 15,
              isOutOfStock: false,
              category: i < 5 ? "Snacks" : i < 10 ? "Organic" : "Health Food",
            })),
          },
          {
            id: "4",
            name: "Dairy Products",
            description: "Manual Entry",
            createdAt: new Date("2025-07-20"),
            source: "Manual Entry",
            products: Array.from({ length: 8 }, (_, i) => ({
              id: `4-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 8,
              isOutOfStock: false,
              category: i < 4 ? "Dairy" : "Refrigerated",
            })),
          },
          {
            id: "5",
            name: "Cleaning Supplies",
            description: "Imported from Code",
            createdAt: new Date("2025-07-21"),
            source: "Imported from Code",
            products: Array.from({ length: 31 }, (_, i) => ({
              id: `5-${i}`,
              name: `Product ${i + 1}`,
              quantity: 0,
              isCompleted: i < 31,
              isOutOfStock: false,
              category:
                i < 10 ? "Cleaning" : i < 20 ? "Household" : "Maintenance",
            })),
          },
        ];
  });

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProductName, setSearchProductName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "quantity">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [productSortBy, setProductSortBy] = useState<
    "name" | "quantity" | "completion" | "stock" | "category"
  >("name");
  const [productSortOrder, setProductSortOrder] = useState<"asc" | "desc">(
    "asc"
  );
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCsvImportModal, setShowCsvImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [shareCode, setShareCode] = useState("");
  const [importCode, setImportCode] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductComment, setNewProductComment] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    imageUrl: "",
    comment: "",
    category: "",
  });
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState("");

  // PWA states
  const [_isOffline, setIsOffline] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem("gulu-lists", JSON.stringify(lists));
  }, [lists]);

  // PWA initialization (offline detection only)
  useEffect(() => {
    // Simple offline detection
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineNotice(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowOfflineNotice(true);
      setTimeout(() => setShowOfflineNotice(false), 3000);
    };

    if (typeof window !== "undefined") {
      // Check initial online status
      setIsOffline(!navigator.onLine);

      // Add connectivity listeners
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const selectedList = lists.find((list) => list.id === selectedListId) || null;

  // Get all unique categories from current list
  const availableCategories = useMemo(() => {
    if (!selectedList) return [];
    const categories = selectedList.products
      .map((p) => p.category)
      .filter((cat): cat is string => !!cat)
      .filter((cat, index, arr) => arr.indexOf(cat) === index)
      .sort();
    return categories;
  }, [selectedList]);

  const filteredLists = useMemo(() => {
    return lists
      .filter(
        (list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Calculate completion status for each list
        const aCompletedCount = a.products.filter((p) => p.isCompleted).length;
        const aIsFullyCompleted =
          a.products.length > 0 && aCompletedCount === a.products.length;
        const bCompletedCount = b.products.filter((p) => p.isCompleted).length;
        const bIsFullyCompleted =
          b.products.length > 0 && bCompletedCount === b.products.length;

        // Always sort fully completed lists to the bottom
        if (aIsFullyCompleted !== bIsFullyCompleted) {
          return aIsFullyCompleted ? 1 : -1;
        }

        // Apply regular sorting for lists with same completion status
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === "quantity") {
          return sortOrder === "asc"
            ? a.products.length - b.products.length
            : b.products.length - a.products.length;
        } else {
          // 'date'
          return sortOrder === "asc"
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime();
        }
      });
  }, [lists, searchQuery, sortBy, sortOrder]);

  const generateShareCode = (list: RestockList) => {
    // Create a very compact representation for QR codes
    const shareData = {
      n: list.name.substring(0, 50), // Limit name length
      d: list.description.substring(0, 100), // Limit description length
      p: list.products.slice(0, 20).map((p) => {
        // Limit to 20 products max
        const product: any = {
          n: p.name.substring(0, 30), // Limit product name length
        };

        // Only include non-default values to save space
        if (p.quantity > 0) product.q = p.quantity;
        if (p.comment && p.comment.trim())
          product.c = p.comment.substring(0, 50);
        if (p.category && p.category.trim())
          product.cat = p.category.substring(0, 20);
        // Skip image URLs for QR codes as they're too long

        return product;
      }),
    };

    // Create final data object without empty description
    const finalData: any = { n: shareData.n, p: shareData.p };
    if (shareData.d && shareData.d.trim()) {
      finalData.d = shareData.d;
    }

    const encoded = btoa(JSON.stringify(finalData));
    return encoded;
  };

  const decodeShareCode = (code: string): RestockList | null => {
    try {
      const decoded = JSON.parse(atob(code));

      // Handle both full format and minimal fallback format
      const products = (decoded.p || []).map((p: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        name: p.n || "Unnamed Product",
        quantity: p.q || 0,
        isCompleted: false,
        isOutOfStock: false,
        imageUrl: undefined, // QR codes don't include image URLs
        comment: p.c || undefined,
        category: p.cat || undefined,
      }));

      return {
        id: Date.now().toString(),
        name: decoded.n || "Imported List",
        description:
          decoded.d || `Imported ${products.length} items from QR code`,
        createdAt: new Date(),
        source: "Imported from Code",
        products,
      };
    } catch (error) {
      console.error("Failed to decode share code:", error);
      return null;
    }
  };

  const parseCSV = (content: string): RestockList | null => {
    try {
      const lines = content
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      if (lines.length === 0) {
        throw new Error("CSV content is empty");
      }
      const listName = lines[0].split(",")[0].trim() || "Imported List";
      const products: Product[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((part) => part.trim());
        const productName = parts[0] || `Product ${products.length + 1}`;
        const category = parts[1] || "";
        const imageUrl = parts[2] || "";
        const comment = parts[3] || "";
        products.push({
          id: `${Date.now()}-${products.length}`,
          name: productName,
          quantity: 0,
          isCompleted: false,
          isOutOfStock: false,
          imageUrl: imageUrl || undefined,
          comment: comment || undefined,
          category: category || undefined,
        });
      }
      return {
        id: Date.now().toString(),
        name: listName,
        description: `Imported from CSV on ${new Date().toLocaleDateString()}`,
        createdAt: new Date(),
        source: "Imported from CSV",
        products,
      };
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Invalid CSV format"
      );
      return null;
    }
  };

  const handleCsvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setImportError("Please select a CSV file");
      return;
    }

    setImportError(""); // Clear any previous errors
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      setCsvFile(file);
    };
    reader.onerror = () => {
      setImportError("Error reading file. Please try again.");
    };
    reader.readAsText(file);
  };

  const importCsv = () => {
    if (!csvFile) {
      setImportError("Please select a CSV file");
      return;
    }
    if (!csvContent.trim()) {
      setImportError("Unable to read file content. Please try again.");
      return;
    }
    const importedList = parseCSV(csvContent);
    if (importedList) {
      setLists([...lists, importedList]);
      setShowCsvImportModal(false);
      setCsvContent("");
      setCsvFile(null);
      setImportError("");
      setSelectedListId(importedList.id);
    }
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: RestockList = {
        id: Date.now().toString(),
        name: newListName,
        description: newListDescription,
        createdAt: new Date(),
        products: [],
        source: "Manual Entry",
      };
      setLists([...lists, newList]);
      setNewListName("");
      setNewListDescription("");
      setShowNewListForm(false);
    }
  };

  const shareList = (list: RestockList) => {
    const code = generateShareCode(list);
    setShareCode(code);

    // Generate QR code with error correction and fallback
    QRCode.toDataURL(code, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "L", // Low error correction for more data capacity
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then((url: string) => {
        setQrCodeDataUrl(url);
      })
      .catch((err: Error) => {
        console.warn("QR code too large, trying smaller format:", err);

        // Fallback: Create an even more compact version
        const minimalData = {
          n: list.name.substring(0, 20),
          p: list.products.slice(0, 10).map((p) => ({
            n: p.name.substring(0, 15),
            ...(p.quantity > 0 && { q: p.quantity }),
          })),
        };

        const minimalCode = btoa(JSON.stringify(minimalData));

        // Try again with minimal data
        QRCode.toDataURL(minimalCode, {
          width: 256,
          margin: 2,
          errorCorrectionLevel: "L",
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        })
          .then((url: string) => {
            setQrCodeDataUrl(url);
            // Update the share code to the minimal version that worked
            setShareCode(minimalCode);
          })
          .catch((finalErr: Error) => {
            console.error(
              "QR code generation failed even with minimal data:",
              finalErr
            );
            setQrCodeDataUrl(""); // No QR code available
          });
      });

    setShowShareModal(true);
  };

  const importList = () => {
    if (!importCode.trim()) {
      setImportError("Please enter a share code");
      return;
    }
    const importedList = decodeShareCode(importCode.trim());
    if (importedList) {
      setLists([...lists, importedList]);
      setShowImportModal(false);
      setImportCode("");
      setImportError("");
      setSelectedListId(importedList.id);
    } else {
      setImportError(
        "Invalid share code. Please check the code and try again."
      );
    }
  };

  const startQrScanner = async () => {
    try {
      // Check if the browser supports camera access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setImportError("Camera access not supported in this browser");
        return;
      }

      setShowQrScanner(true);
      setImportError("");
    } catch (error) {
      setImportError("Unable to access camera. Please check permissions.");
      console.error("Camera access error:", error);
    }
  };

  const stopQrScanner = () => {
    setShowQrScanner(false);
  };

  const handleQrCodeDetected = (code: string) => {
    setImportCode(code);
    setShowQrScanner(false);
    setImportError("");

    // Auto-import if the code is valid
    const importedList = decodeShareCode(code.trim());
    if (importedList) {
      setLists([...lists, importedList]);
      setShowImportModal(false);
      setImportCode("");
      setSelectedListId(importedList.id);
    } else {
      setImportError("Invalid QR code. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteList = (listId: string) =>
    setLists(lists.filter((list) => list.id !== listId));

  const resetAllProducts = () => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) => ({
        ...p,
        quantity: 0,
        isCompleted: false,
        completedAt: undefined,
      })),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const resetProductQuantity = (productId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId ? { ...p, quantity: 0 } : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const updateProductQuantity = (productId: string, change: number) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(0, p.quantity + change) }
          : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const setProductQuantity = (productId: string, quantity: number) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId ? { ...p, quantity: Math.max(0, quantity) } : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const startEditingQuantity = (productId: string, currentQuantity: number) => {
    setEditingQuantity(productId);
    setTempQuantity(currentQuantity.toString());
  };

  const saveQuantityEdit = (productId: string) => {
    const newQuantity = parseInt(tempQuantity) || 0;
    setProductQuantity(productId, newQuantity);
    setEditingQuantity(null);
    setTempQuantity("");
  };

  const cancelQuantityEdit = () => {
    setEditingQuantity(null);
    setTempQuantity("");
  };

  const handleQuantityKeyPress = (
    e: React.KeyboardEvent,
    productId: string
  ) => {
    if (e.key === "Enter") {
      saveQuantityEdit(productId);
    } else if (e.key === "Escape") {
      cancelQuantityEdit();
    }
  };

  const toggleProductCompletion = (productId: string) => {
    if (!selectedList) return;

    const product = selectedList.products.find((p) => p.id === productId);
    if (!product) return;

    const isNowCompleted = !product.isCompleted;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              isCompleted: isNowCompleted,
              completedAt: isNowCompleted ? new Date() : undefined,
            }
          : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const toggleOutOfStock = (productId: string) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === productId ? { ...p, isOutOfStock: !p.isOutOfStock } : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
  };

  const addProduct = () => {
    if (!selectedList || !newProductName.trim()) return;
    const newProduct: Product = {
      id: Date.now().toString(),
      name: newProductName,
      quantity: 0,
      isCompleted: false,
      isOutOfStock: false,
      imageUrl: newProductImage || undefined,
      comment: newProductComment || undefined,
      category: newProductCategory || undefined,
    };
    const updatedList = {
      ...selectedList,
      products: [...selectedList.products, newProduct],
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
    setNewProductName("");
    setNewProductImage("");
    setNewProductComment("");
    setNewProductCategory("");
    setShowAddProductModal(false);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      imageUrl: product.imageUrl || "",
      comment: product.comment || "",
      category: product.category || "",
    });
    setShowEditModal(true);
  };

  const saveProductEdit = () => {
    if (!editingProduct || !selectedList || !editForm.name.trim()) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editForm.name,
              imageUrl: editForm.imageUrl || undefined,
              comment: editForm.comment || undefined,
              category: editForm.category || undefined,
            }
          : p
      ),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const deleteProductFromEdit = () => {
    if (!editingProduct || !selectedList) return;
    const updatedList = {
      ...selectedList,
      products: selectedList.products.filter((p) => p.id !== editingProduct.id),
    };
    setLists(
      lists.map((list) => (list.id === selectedList.id ? updatedList : list))
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  if (selectedList) {
    const filteredProducts = selectedList.products
      .filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(searchProductName.toLowerCase());
        const matchesCategory =
          !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // First, always sort out-of-stock items to the bottom
        if (a.isOutOfStock !== b.isOutOfStock) {
          return a.isOutOfStock ? 1 : -1;
        }

        // Second, within in-stock items, always sort completed items to the bottom
        // (unless specifically sorting by completion status)
        if (productSortBy !== "completion" && a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }

        // Handle different sort options for items with same stock and completion status
        let comparison = 0;

        switch (productSortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "quantity":
            comparison = a.quantity - b.quantity;
            break;
          case "completion":
            // For completion sort, allow user to control the order
            comparison =
              a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
            break;
          case "stock":
            // Since we already handled stock status above, sort by name as secondary
            comparison = a.name.localeCompare(b.name);
            break;
          case "category":
            comparison = (a.category || "").localeCompare(b.category || "");
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }

        // Apply sort order
        if (productSortOrder === "desc") {
          comparison = -comparison;
        }

        // Secondary sort by name if primary sort values are equal (except for name sort)
        if (comparison === 0 && productSortBy !== "name") {
          comparison = a.name.localeCompare(b.name);
        }

        return comparison;
      });

    const completedCount = selectedList.products.filter(
      (p) => p.isCompleted
    ).length;
    const totalCount = selectedList.products.length;

    return (
      <div
        className="app-container min-h-screen"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        {/* Background should be light gray */}

        {/* Header */}
        <header className="app-header bg-white border-b border-gray-200">
          <div className="app-header-content max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setSelectedListId(null)}
                className="app-header-btn text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
                <span>Back to Lists</span>
              </button>
              <button
                onClick={resetAllProducts}
                className="app-header-btn danger text-red-600 hover:text-red-700"
              >
                <span>Reset All</span>
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main max-w-4xl mx-auto px-6 py-8">
          {/* Title Section */}
          <div className="mb-6 w-full">
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {selectedList.name}
              </h1>
              <p className="text-gray-500 text-sm">
                {completedCount} of {totalCount} items completed
              </p>
            </div>
          </div>

          {/* Search Bar - Full Width */}
          <div className="mb-8 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="searchProducts"
                name="searchProducts"
                placeholder="Search products..."
                value={searchProductName}
                onChange={(e) => setSearchProductName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
              />
            </div>
          </div>

          {/* Sort and Filter Controls */}
          <div className="mb-6 w-full">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Category Filter */}
              <div className="flex items-center gap-6">
                {availableCategories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm whitespace-nowrap">
                      Filter
                    </span>
                    <select
                      id="categoryFilter"
                      name="categoryFilter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
                    >
                      <option value="">All Categories</option>
                      {availableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Right side - Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm whitespace-nowrap">
                  Sort
                </span>
                <select
                  id="productSortBy"
                  name="productSortBy"
                  value={productSortBy}
                  onChange={(e) =>
                    setProductSortBy(
                      e.target.value as
                        | "name"
                        | "quantity"
                        | "completion"
                        | "stock"
                        | "category"
                    )
                  }
                  className="bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
                >
                  <option value="name">Name</option>
                  <option value="category">Category</option>
                  <option value="quantity">Quantity</option>
                  <option value="completion">Completion</option>
                  <option value="stock">Stock Status</option>
                </select>
                <button
                  onClick={() =>
                    setProductSortOrder(
                      productSortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                >
                  {productSortOrder === "asc" ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`app-product-card bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  product.isOutOfStock ? "out-of-stock" : ""
                }`}
                onClick={() => openEditModal(product)}
              >
                {/* Top Row - Cart left, Product Name center, Refresh right */}
                <div className="top-icons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOutOfStock(product.id);
                    }}
                    className={`icon-button ${
                      product.isOutOfStock ? "out-of-stock-active" : ""
                    }`}
                    title={
                      product.isOutOfStock
                        ? "Mark as In Stock"
                        : "Mark as Out of Stock"
                    }
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-gray-700" />
                  </button>

                  {/* Product Name - Centered between icons */}
                  <div className="product-name-inline">
                    <h3 className="text-base font-semibold text-gray-900">
                      {product.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetProductQuantity(product.id);
                    }}
                    className="icon-button"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>

                {/* Product Image - 16:9 ratio */}
                {product.imageUrl && (
                  <div className="image-container">
                    <div className="image-frame">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Quantity Controls - Centered pill style */}
                <div className="quantity-controls">
                  <div className="quantity-pill">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, -1);
                      }}
                      className="quantity-button"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-700" />
                    </button>

                    {editingQuantity === product.id ? (
                      <input
                        type="number"
                        inputMode="numeric"
                        value={tempQuantity}
                        onChange={(e) => setTempQuantity(e.target.value)}
                        onBlur={() => saveQuantityEdit(product.id)}
                        onKeyDown={(e) => handleQuantityKeyPress(e, product.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="quantity-input"
                        autoFocus
                        min="0"
                      />
                    ) : (
                      <span
                        className="quantity-display clickable"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingQuantity(product.id, product.quantity);
                        }}
                      >
                        {product.quantity}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, 1);
                      }}
                      className="quantity-button"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Mark Done Button - Full width */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProductCompletion(product.id);
                  }}
                  className={`mark-done-button ${
                    product.isCompleted ? "completed" : "pending"
                  }`}
                >
                  Mark Done
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div
                className="app-list-card"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  padding: "2rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <p className="text-gray-500 text-lg">No products found.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search terms or add a new product.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowAddProductModal(true)}
          className="app-fab"
          title="Add Product"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setNewProductName("");
                    setNewProductImage("");
                    setNewProductComment("");
                    setNewProductCategory("");
                  }}
                  className="close-button p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="newProductName"
                    name="newProductName"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addProduct()}
                    placeholder="Enter product name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    id="newProductCategory"
                    name="newProductCategory"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    placeholder="Enter category"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    id="newProductImage"
                    name="newProductImage"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    id="newProductComment"
                    name="newProductComment"
                    value={newProductComment}
                    onChange={(e) => setNewProductComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addProduct}
                    className="primary flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                    disabled={!newProductName.trim()}
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProductModal(false);
                      setNewProductName("");
                      setNewProductImage("");
                      setNewProductComment("");
                      setNewProductCategory("");
                    }}
                    className="secondary px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && editingProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Product</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="close-button p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="editProductName"
                    name="editProductName"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter product name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    id="editProductCategory"
                    name="editProductCategory"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter category"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    id="editProductImageUrl"
                    name="editProductImageUrl"
                    value={editForm.imageUrl}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        imageUrl: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    id="editProductComment"
                    name="editProductComment"
                    value={editForm.comment}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        comment: e.target.value,
                      })
                    }
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={saveProductEdit}
                    className="primary flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={deleteProductFromEdit}
                    className="danger px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="app-container min-h-screen"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      {/* Background should be light gray */}
      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          You're offline. Changes will sync when you're back online.
        </div>
      )}

      {/* PWA Install Prompt */}
      <PWAInstaller />

      {/* Header */}
      <header className="app-header bg-white border-b border-gray-200">
        <div className="app-header-content max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="app-logo">
              <span>G</span>
            </div>
            <button
              onClick={() => setShowNewListForm(true)}
              className="app-new-list-btn"
            >
              New List
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main max-w-4xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="app-action-buttons flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 mb-6 w-full">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="app-import-btn"
              >
                <Download className="w-4 h-4 text-gray-700" />
                Code
              </button>
              <button
                onClick={() => setShowCsvImportModal(true)}
                className="app-import-btn"
              >
                <Download className="w-4 h-4 text-gray-700" />
                CSV
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm font-medium">Sort:</span>
              <select
                id="sortBy"
                name="sortBy"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "date" | "quantity")
                }
                className="text-gray-700 bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="quantity">Items</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search - Full Width */}
        <div className="mb-12 w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              id="searchLists"
              name="searchLists"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Lists */}
        <div className="app-lists space-y-6">
          {filteredLists.map((list) => {
            const completedCount = list.products.filter(
              (p) => p.isCompleted
            ).length;
            const totalCount = list.products.length;
            const progressPercentage =
              totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
              <div
                key={list.id}
                className="app-list-card bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Update lastViewedAt when clicking on a list
                  const updatedLists = lists.map((l) =>
                    l.id === list.id ? { ...l, lastViewedAt: new Date() } : l
                  );
                  setLists(updatedLists);
                  setSelectedListId(list.id);
                }}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="app-list-header flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="app-list-title text-lg font-semibold text-gray-900 truncate">
                      {list.name || "Test Title"}
                    </h3>
                  </div>

                  <div className="app-list-actions flex flex-col items-end gap-2">
                    <div className="app-action-buttons-container flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareList(list);
                        }}
                        className="app-action-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share list"
                      >
                        <Share2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteList(list.id);
                        }}
                        className="app-action-btn p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete list"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                    <span className="app-list-date text-sm text-gray-500 font-medium">
                      {list.lastViewedAt
                        ? `Last viewed ${list.lastViewedAt.toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}`
                        : `Created ${list.createdAt.toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}`}
                    </span>
                  </div>
                </div>

                <p className="app-stock-status text-sm text-gray-600 mb-4">
                  {completedCount} out of {totalCount} in stock
                </p>

                <div className="app-progress-bg w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="app-progress-bar bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: "#0f766e",
                      height: "0.5rem",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredLists.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white border border-gray-300 rounded-lg p-12">
              <p className="text-gray-500 text-lg font-medium">
                No lists found matching your search.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search terms or create a new list.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* New List Form Dialog */}
      {showNewListForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNewListForm(false);
            }
          }}
        >
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New List
              </h2>
              <button
                onClick={() => setShowNewListForm(false)}
                className="close-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="newListName"
                >
                  List Name
                </label>
                <input
                  type="text"
                  id="newListName"
                  name="newListName"
                  placeholder="Enter list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newListName.trim()) {
                      createNewList();
                    }
                  }}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  autoFocus
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="newListDescription"
                >
                  Description (optional)
                </label>
                <textarea
                  id="newListDescription"
                  name="newListDescription"
                  placeholder="Enter description..."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewListForm(false)}
                className="secondary flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createNewList}
                disabled={!newListName.trim()}
                className="primary flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImportModal(false);
              setImportCode("");
              setImportError("");
            }
          }}
        >
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Import List
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportCode("");
                  setImportError("");
                }}
                className="close-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Paste a share code or scan a QR code to import a list shared by
              someone else.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="importCode"
                  name="importCode"
                  value={importCode}
                  onChange={(e) => {
                    setImportCode(e.target.value);
                    setImportError(""); // Clear error when user types
                  }}
                  placeholder="Paste share code here..."
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  autoFocus
                />
                <button
                  onClick={startQrScanner}
                  className="flex-shrink-0 px-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Scan QR code"
                  style={{ minWidth: "48px", minHeight: "48px" }}
                >
                  📷
                </button>
              </div>
              {importError && (
                <p className="text-red-500 text-sm">{importError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportCode("");
                  setImportError("");
                }}
                className="secondary flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={importList}
                disabled={!importCode.trim()}
                className="primary flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Import List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQrScanner && (
        <QrScannerModal
          onQrCodeDetected={handleQrCodeDetected}
          onClose={stopQrScanner}
        />
      )}

      {/* Share Code Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Share List</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="close-button p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Copy and share this code with others to import your list.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="shareCode"
                  name="shareCode"
                  readOnly
                  value={shareCode}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(shareCode)}
                  className="px-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? "✅" : "📋"}
                </button>
              </div>
              {qrCodeDataUrl ? (
                <div className="flex justify-center mt-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code for share code"
                      className="w-64 h-64 mx-auto"
                    />
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Scan to import list
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded mx-auto">
                      <p className="text-gray-500 text-sm text-center px-4">
                        QR code unavailable
                        <br />
                        (List too large)
                      </p>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Use the text code above instead
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="primary px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Import from CSV</h2>
              <button
                onClick={() => {
                  setShowCsvImportModal(false);
                  setCsvContent("");
                  setCsvFile(null);
                  setImportError("");
                }}
                className="close-button p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Select a CSV file to import a list with products and their
              details.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  id="csvFile"
                  name="csvFile"
                  accept=".csv"
                  onChange={handleCsvFileUpload}
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
              {csvFile && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Selected file:{" "}
                  <span className="font-medium">{csvFile.name}</span>
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p className="mb-2 font-medium">Expected CSV format:</p>
                <div className="bg-gray-50 p-3 rounded-lg border font-mono text-xs">
                  ListName
                  <br />
                  Product1,category,image-url,comment
                  <br />
                  Product2,category,image-url,comment
                </div>
              </div>
              {importError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {importError}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCsvImportModal(false);
                  setCsvContent("");
                  setCsvFile(null);
                  setImportError("");
                }}
                className="secondary flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={importCsv}
                disabled={!csvFile}
                className="primary flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Import List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
