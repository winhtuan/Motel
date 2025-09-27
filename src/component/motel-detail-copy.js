// import React, { useEffect, useRef, useState } from "react";

// export default function PanoramaViewer() {
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Mouse control
//   const mouseRef = useRef({
//     isDown: false,
//     lastX: 0,
//     lastY: 0,
//     rotationX: 0,
//     rotationY: 0,
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     let animationId;
//     let image = new Image();

//     // Set canvas size
//     const resizeCanvas = () => {
//       const rect = canvas.parentElement.getBoundingClientRect();
//       canvas.width = rect.width;
//       canvas.height = rect.height;
//     };

//     resizeCanvas();

//     // Simple 360 viewer using Canvas API
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       if (imageLoaded && image.complete) {
//         // Simple pan effect by changing source rectangle
//         const sourceX = mouseRef.current.rotationX % image.width;
//         const sourceY = Math.max(
//           0,
//           Math.min(
//             image.height - canvas.height,
//             image.height / 2 + mouseRef.current.rotationY * 2
//           )
//         );

//         // Draw the image with panning effect
//         try {
//           // Draw main view
//           ctx.drawImage(
//             image,
//             sourceX,
//             sourceY,
//             Math.min(canvas.width, image.width - sourceX),
//             canvas.height,
//             0,
//             0,
//             Math.min(canvas.width, image.width - sourceX),
//             canvas.height
//           );

//           // If we need to wrap around horizontally
//           if (sourceX > 0 && canvas.width > image.width - sourceX) {
//             ctx.drawImage(
//               image,
//               0,
//               sourceY,
//               canvas.width - (image.width - sourceX),
//               canvas.height,
//               image.width - sourceX,
//               0,
//               canvas.width - (image.width - sourceX),
//               canvas.height
//             );
//           }
//         } catch (e) {
//           console.error("Drawing error:", e);
//         }
//       } else {
//         // Draw placeholder
//         const gradient = ctx.createLinearGradient(
//           0,
//           0,
//           canvas.width,
//           canvas.height
//         );
//         gradient.addColorStop(0, "#1a1a1a");
//         gradient.addColorStop(0.5, "#333333");
//         gradient.addColorStop(1, "#1a1a1a");

//         ctx.fillStyle = gradient;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // Draw loading text
//         ctx.fillStyle = "white";
//         ctx.font = "20px Arial";
//         ctx.textAlign = "center";
//         ctx.fillText(
//           "Đang tải ảnh 360°...",
//           canvas.width / 2,
//           canvas.height / 2
//         );
//       }

//       animationId = requestAnimationFrame(draw);
//     };

//     // Start drawing loop
//     draw();

//     // Load test images
//     const testImages = [
//       "https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg",
//       // Fallback: create a simple panorama pattern
//       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4N0NFRUY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOThGQjk4O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ2OEE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPgo8L3N2Zz4K",
//     ];

//     let currentImageIndex = 0;

//     const tryLoadImage = () => {
//       if (currentImageIndex >= testImages.length) {
//         setError("Không thể tải ảnh 360°");
//         setIsLoading(false);
//         return;
//       }

//       image = new Image();
//       image.crossOrigin = "anonymous";

//       image.onload = () => {
//         console.log(
//           "Image loaded successfully:",
//           testImages[currentImageIndex]
//         );
//         setImageLoaded(true);
//         setIsLoading(false);
//         setError(null);
//       };

//       image.onerror = () => {
//         console.log("Failed to load:", testImages[currentImageIndex]);
//         currentImageIndex++;
//         setTimeout(tryLoadImage, 500);
//       };

//       console.log("Trying to load:", testImages[currentImageIndex]);
//       image.src = testImages[currentImageIndex];
//     };

//     // Start loading
//     tryLoadImage();

//     // Mouse events
//     const handleMouseDown = (e) => {
//       mouseRef.current.isDown = true;
//       mouseRef.current.lastX = e.clientX;
//       mouseRef.current.lastY = e.clientY;
//       canvas.style.cursor = "grabbing";
//     };

//     const handleMouseMove = (e) => {
//       if (!mouseRef.current.isDown) return;

//       const deltaX = e.clientX - mouseRef.current.lastX;
//       const deltaY = e.clientY - mouseRef.current.lastY;

//       mouseRef.current.rotationX -= deltaX * 2;
//       mouseRef.current.rotationY += deltaY * 2;

//       // Clamp vertical rotation
//       mouseRef.current.rotationY = Math.max(
//         -200,
//         Math.min(200, mouseRef.current.rotationY)
//       );

//       mouseRef.current.lastX = e.clientX;
//       mouseRef.current.lastY = e.clientY;
//     };

//     const handleMouseUp = () => {
//       mouseRef.current.isDown = false;
//       canvas.style.cursor = "grab";
//     };

//     const handleWheel = (e) => {
//       e.preventDefault();
//       // Simple zoom by changing canvas scale
//       const rect = canvas.getBoundingClientRect();
//       const scaleChange = e.deltaY > 0 ? 1.1 : 0.9;
//       const currentScale = canvas.style.transform.match(/scale\(([^)]+)\)/)
//         ? parseFloat(canvas.style.transform.match(/scale\(([^)]+)\)/)[1])
//         : 1;
//       const newScale = Math.max(0.5, Math.min(2, currentScale * scaleChange));
//       canvas.style.transform = `scale(${newScale})`;
//     };

//     // Touch events
//     const handleTouchStart = (e) => {
//       if (e.touches.length === 1) {
//         e.preventDefault();
//         mouseRef.current.isDown = true;
//         mouseRef.current.lastX = e.touches[0].clientX;
//         mouseRef.current.lastY = e.touches[0].clientY;
//       }
//     };

//     const handleTouchMove = (e) => {
//       if (e.touches.length === 1 && mouseRef.current.isDown) {
//         e.preventDefault();

//         const deltaX = e.touches[0].clientX - mouseRef.current.lastX;
//         const deltaY = e.touches[0].clientY - mouseRef.current.lastY;

//         mouseRef.current.rotationX -= deltaX * 2;
//         mouseRef.current.rotationY += deltaY * 2;
//         mouseRef.current.rotationY = Math.max(
//           -200,
//           Math.min(200, mouseRef.current.rotationY)
//         );

//         mouseRef.current.lastX = e.touches[0].clientX;
//         mouseRef.current.lastY = e.touches[0].clientY;
//       }
//     };

//     const handleTouchEnd = () => {
//       mouseRef.current.isDown = false;
//     };

//     // Add event listeners
//     canvas.addEventListener("mousedown", handleMouseDown);
//     canvas.addEventListener("mousemove", handleMouseMove);
//     canvas.addEventListener("mouseup", handleMouseUp);
//     canvas.addEventListener("wheel", handleWheel, { passive: false });
//     canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
//     canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
//     canvas.addEventListener("touchend", handleTouchEnd);

//     canvas.style.cursor = "grab";

//     window.addEventListener("resize", resizeCanvas);

//     // Cleanup
//     return () => {
//       if (animationId) {
//         cancelAnimationFrame(animationId);
//       }

//       canvas.removeEventListener("mousedown", handleMouseDown);
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseup", handleMouseUp);
//       canvas.removeEventListener("wheel", handleWheel);
//       canvas.removeEventListener("touchstart", handleTouchStart);
//       canvas.removeEventListener("touchmove", handleTouchMove);
//       canvas.removeEventListener("touchend", handleTouchEnd);
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100%",
//         height: "600px",
//         borderRadius: "12px",
//         overflow: "hidden",
//         background: "#000",
//       }}
//     >
//       <canvas
//         ref={canvasRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//         }}
//       />

//       {isLoading && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             color: "white",
//             fontSize: "18px",
//             textAlign: "center",
//             zIndex: 10,
//             background: "rgba(0,0,0,0.8)",
//             padding: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <div>🔄 Đang tải ảnh 360°...</div>
//           <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
//             Đang thử các nguồn ảnh...
//           </div>
//         </div>
//       )}

//       {error && !imageLoaded && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             color: "#ff6b6b",
//             fontSize: "16px",
//             textAlign: "center",
//             zIndex: 10,
//             background: "rgba(0,0,0,0.8)",
//             padding: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <div>❌ {error}</div>
//           <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
//             Sử dụng gradient mẫu
//           </div>
//         </div>
//       )}

//       <div
//         style={{
//           position: "absolute",
//           bottom: "20px",
//           left: "20px",
//           background: "rgba(0,0,0,0.7)",
//           color: "white",
//           padding: "8px 12px",
//           borderRadius: "6px",
//           fontSize: "14px",
//           zIndex: 5,
//         }}
//       >
//         🖱️ Kéo chuột để xoay • 🖲️ Scroll để zoom
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           background: "rgba(0,0,0,0.6)",
//           color: "white",
//           padding: "6px 10px",
//           borderRadius: "8px",
//           fontSize: "12px",
//           zIndex: 5,
//         }}
//       >
//         {imageLoaded ? "🖼️ Ảnh 360°" : "🎨 Gradient mẫu"}
//       </div>
//     </div>
//   );
// }
