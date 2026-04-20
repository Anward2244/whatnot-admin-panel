// import React, { useState, useEffect, useRef } from 'react';

// const Chat = () => {
//   // Users list with their conversations
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "Anwar Dudekula",
//       avatar: "A",
//       status: "online",
//       messages: [
//         { id: 1, text: "Hello! Is the Realme brand update live?", sender: "user", time: "07:13 PM" },
//         { id: 2, text: "Yes, I just updated it from the admin panel.", sender: "admin", time: "07:15 PM" },
//       ],
//       unread: 0
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       avatar: "S",
//       status: "online",
//       messages: [
//         { id: 1, text: "Can you review the product catalog?", sender: "user", time: "03:45 PM" },
//         { id: 2, text: "Done! Everything looks good.", sender: "admin", time: "03:50 PM" },
//       ],
//       unread: 1
//     },
//     {
//       id: 3,
//       name: "Michael Chen",
//       avatar: "M",
//       status: "offline",
//       messages: [
//         { id: 1, text: "When will the new features be deployed?", sender: "user", time: "02:30 PM" },
//       ],
//       unread: 3
//     },
//     {
//       id: 4,
//       name: "Emma Wilson",
//       avatar: "E",
//       status: "online",
//       messages: [],
//       unread: 2
//     },
//   ]);

//   const [activeUserId, setActiveUserId] = useState(1);
//   const [inputText, setInputText] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const scrollRef = useRef(null);

//   const activeUser = users.find(u => u.id === activeUserId);
//   const messages = activeUser?.messages || [];

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     const newMessage = {
//       id: Date.now(),
//       text: inputText,
//       sender: "admin",
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     // Update the active user's messages
//     setUsers(users.map(u => 
//       u.id === activeUserId 
//         ? { ...u, messages: [...u.messages, newMessage] }
//         : u
//     ));
//     setInputText('');
//   };

//   const handleSelectUser = (userId) => {
//     setActiveUserId(userId);
//     // Clear unread count
//     setUsers(users.map(u => 
//       u.id === userId 
//         ? { ...u, unread: 0 }
//         : u
//     ));
//     // Close sidebar on mobile after selecting user
//     if (window.innerWidth < 768) {
//       setShowSidebar(false);
//     }
//   };

//   return (
//     <div className="container-fluid py-5 mt-4 mb-3" style={{ paddingLeft: window.innerWidth < 768 ? '10px' : undefined, paddingRight: window.innerWidth < 768 ? '10px' : undefined, overflowY:'hidden' }}>
//       <div className="row" style={{ height: window.innerWidth < 768 ? 'calc(100vh - 50px)' : '490px' }}>
        
//         {/* Mobile Sidebar Toggle */}
//         {window.innerWidth < 768 && (
//           <div className="mb-3">
//             <button 
//               className="btn btn-outline-primary w-100"
//               onClick={() => setShowSidebar(!showSidebar)}
//             >
//               <i className="fas fa-users me-2"></i>
//               {showSidebar ? 'Hide' : 'Show'} Contacts ({users.length})
//             </button>
//           </div>
//         )}
        
//         {/* Users List Sidebar */}
//         <div className={`col-md-4 col-lg-3 ${window.innerWidth < 768 ? (showSidebar ? 'd-block' : 'd-none') : ''}`}>
//           <div className="card shadow-sm border-0" style={{ 
//             height: window.innerWidth < 768 ? '300px' : '100%', 
//             borderRadius: '15px', 
//             overflowY: 'auto',
//             ...(window.innerWidth < 768 ? {
//               position: 'absolute',
//               top: '60px',
//               left: '10px',
//               right: '10px',
//               zIndex: 1000
//             } : {})
//           }}>
//             <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '15px 15px 0 0' }}>
//               <h6 className="mb-0 fw-bold">Messages</h6>
//               <small className="text-muted">{users.length} contacts</small>
//             </div>
            
//             <div className="card-body p-0">
//               {users.map((user) => (
//                 <div
//                   key={user.id}
//                   onClick={() => handleSelectUser(user.id)}
//                   className={`px-3 py-3 border-bottom cursor-pointer transition ${
//                     activeUserId === user.id ? 'bg-light border-start border-primary' : 'hover-light'
//                   }`}
//                   style={{
//                     cursor: 'pointer',
//                     backgroundColor: activeUserId === user.id ? '#f8f9fa' : 'transparent',
//                     borderLeft: activeUserId === user.id ? '4px solid #0d6efd' : 'none',
//                     transition: 'all 0.2s ease'
//                   }}
//                 >
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center flex-grow-1">
//                       <div 
//                         className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold`}
//                         style={{
//                           width: window.innerWidth < 768 ? '35px' : '40px',
//                           height: window.innerWidth < 768 ? '35px' : '40px',
//                           backgroundColor: 'black',
//                           marginRight: '10px',
//                           position: 'relative',
//                           fontSize: window.innerWidth < 768 ? '14px' : '12px'
//                         }}
//                       >
//                         {user.avatar}
//                         <span
//                           className={`position-absolute bottom-0 end-0 rounded-circle`}
//                           style={{
//                             width: window.innerWidth < 768 ? '10px' : '12px',
//                             height: window.innerWidth < 768 ? '10px' : '12px',
//                             backgroundColor: user.status === 'online' ? '#28a745' : '#6c757d',
//                             border: '2px solid white'
//                           }}
//                         ></span>
//                       </div>
                      
//                       <div className="flex-grow-1">
//                         <h6 className="mb-0 fw-bold" style={{ fontSize: window.innerWidth < 768 ? '14px' : '12px' }}>
//                           {user.name}
//                         </h6>
//                         <small className={user.status === 'online' ? 'text-success' : 'text-muted'} style={{ fontSize: '12px' }}>
//                           {user.status === 'online' ? '● Online' : '● Offline'}
//                         </small>
//                       </div>
//                     </div>
                    
//                     {user.unread > 0 && (
//                       <span 
//                         className="badge bg-danger rounded-pill ms-2"
//                         style={{ fontSize: '10px' }}
//                       >
//                         {user.unread}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Chat Box */}
//         <div className="col-md-8 col-lg-9 ps-md-2">
//           {activeUser && (
//             <div className="card shadow-sm border-0" style={{ height: '100%', borderRadius: '15px', display: 'flex', flexDirection: 'column' }}>
              
//               {/* Chat Header */}
//               <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '15px 15px 0 0' }}>
//                 <div className="d-flex align-items-center">
//                   <div 
//                     className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
//                     style={{ 
//                       width: window.innerWidth < 768 ? '35px' : '40px', 
//                       height: window.innerWidth < 768 ? '35px' : '40px',
//                       position: 'relative'
//                     }}
//                   >
//                     <span className="fw-bold" style={{ fontSize: window.innerWidth < 768 ? '14px' : '12px' }}>
//                       {activeUser.avatar}
//                     </span>
//                     <span
//                       className="position-absolute bottom-0 end-0 rounded-circle"
//                       style={{
//                         width: window.innerWidth < 768 ? '10px' : '12px',
//                         height: window.innerWidth < 768 ? '10px' : '12px',
//                         backgroundColor: activeUser.status === 'online' ? '#28a745' : '#6c757d',
//                         border: '2px solid white'
//                       }}
//                     ></span>
//                   </div>
//                   <div className="ms-3">
//                     <h6 className="mb-0 fw-bold" style={{ fontSize: window.innerWidth < 768 ? '16px' : '18px' }}>
//                       {activeUser.name}
//                     </h6>
//                     <small className={activeUser.status === 'online' ? 'text-success' : 'text-muted'}>
//                       {activeUser.status === 'online' ? '● Online' : '● Offline'}
//                     </small>
//                   </div>
//                 </div>
//               </div>

//               {/* Message Area */}
//               <div 
//                 ref={scrollRef}
//                 className="card-body bg-light" 
//                 style={{ 
//                   overflowY: 'auto', 
//                   padding: window.innerWidth < 768 ? '15px' : '20px',
//                   scrollBehavior: 'smooth',
//                   height: window.innerWidth < 768 ? 'calc(100vh - 320px)' : '310px'
//                 }}
//               >
//                 {messages.length > 0 ? (
//                   messages.map((msg) => (
//                     <div 
//                       key={msg.id} 
//                       className={`d-flex mb-3 ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}
//                     >
//                       <div 
//                         className={`p-3 shadow-sm ${msg.sender === 'admin' ? 'bg-primary text-white' : 'bg-white text-dark'}`}
//                         style={{ 
//                           maxWidth: window.innerWidth < 768 ? '85%' : '75%', 
//                           borderRadius: msg.sender === 'admin' ? '18px 18px 0 18px' : '18px 18px 18px 0',
//                           fontSize: window.innerWidth < 768 ? '14px' : '16px'
//                         }}
//                       >
//                         <p className="mb-1" style={{ fontSize: window.innerWidth < 768 ? '14px' : '14px' }}>
//                           {msg.text}
//                         </p>
//                         <div className={`text-uppercase fw-light ${msg.sender === 'admin' ? 'text-white-50' : 'text-muted'}`} 
//                              style={{ fontSize: '10px' }}>
//                           {msg.time}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center text-muted py-5">
//                     <p style={{ fontSize: window.innerWidth < 768 ? '14px' : '14px' }}>
//                       No messages yet. Start the conversation!
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Input Footer */}
//               <div className="card-footer bg-white border-top p-3" style={{ borderRadius: '0 0 15px 15px' }}>
//                 <form onSubmit={handleSendMessage} className="input-group">
//                   <input
//                     type="text"
//                     className="form-control border-0 bg-light"
//                     placeholder="Type a message..."
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     style={{ 
//                       borderRadius: '20px 0 0 20px', 
//                       padding: window.innerWidth < 768 ? '12px 16px' : '10px 20px',
//                       fontSize: window.innerWidth < 768 ? '14px' : '16px'
//                     }}
//                   />
//                   <button 
//                     className="btn btn-primary px-4" 
//                     type="submit"
//                     style={{ 
//                       borderRadius: '0 20px 20px 0',
//                       fontSize: window.innerWidth < 768 ? '14px' : '16px'
//                     }}
//                   >
//                     Send
//                   </button>
//                 </form>
//               </div>

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;