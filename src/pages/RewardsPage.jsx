import React, { useState } from 'react';
import { ShoppingBag, Coins, CheckCircle2, Sparkles, Tag, Gift, Award, Zap } from 'lucide-react';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { REWARDS_STORE } from '../data/rewardsStoreData';
import { useLearning } from '../context/LearningContext';

export default function RewardsPage() {
  const { progress, buyRewardItem } = useLearning();
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleBuy = (item) => {
    const res = buyRewardItem(item);
    setFeedbackMsg(res.message);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const categories = [
    { id: 'all', label: '🌟 All Offers' },
    { id: 'Voucher', label: '🎁 Gift Vouchers' },
    { id: 'Career', label: '💼 Career & Resume' },
    { id: 'Placement', label: '🎯 Mock Interviews' },
    { id: 'AI Pass', label: '🤖 AI Tutor' },
    { id: 'Booster', label: '⚡ Boosters & Shields' }
  ];

  const filteredStore = REWARDS_STORE.filter(item => {
    if (activeCategory === 'all') return true;
    return item.type === activeCategory;
  });

  return (
    <div className="min-vh-100 bg-light dark:bg-dark text-dark dark:text-white d-flex flex-column pb-5 pb-md-0">
      <Header />
      <Navbar />

      <main className="container py-4 flex-grow-1">
        
        {/* Header Title */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-black text-dark dark:text-white d-flex align-items-center gap-2 mb-1">
              <ShoppingBag className="w-7 h-7 text-indigo" /> Premium Rewards & Vouchers Store
            </h2>
            <p className="small text-muted mb-0">
              Redeem your virtual study coins for Amazon vouchers, AI Resume reviews, mock interview passes & Spotify access!
            </p>
          </div>

          <div className="badge bg-warning-subtle text-dark border border-warning rounded-pill px-4 py-2.5 fs-6 font-extrabold shadow-sm d-flex align-items-center gap-2 align-self-start align-self-md-center">
            <Coins className="w-5 h-5 text-warning" /> {progress.coins} Virtual Coins
          </div>
        </div>

        {feedbackMsg && (
          <div className="alert alert-indigo bg-indigo-subtle-custom text-indigo border border-indigo rounded-4 p-3 mb-4 text-center fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo" /> {feedbackMsg}
          </div>
        )}

        {/* Category Pill Filters */}
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'btn-indigo text-white shadow'
                  : 'btn-light border text-secondary hover:border-indigo'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Store Grid */}
        <div className="row g-4 mb-5">
          {filteredStore.map((item) => {
            const isOwned = progress.ownedRewardIds.includes(item.id);
            const isAffordable = progress.coins >= item.price;

            return (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-5 p-4 h-100 d-flex flex-column justify-content-between transition-all hover:shadow-md position-relative overflow-hidden bg-white dark:bg-dark">
                  
                  {/* Badge Ribbon */}
                  {item.badge && (
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold shadow-sm" style={{ fontSize: '0.7rem' }}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span className="fs-1 p-2 bg-light rounded-4 shadow-sm" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </span>
                      <div>
                        <span className="badge bg-indigo-subtle-custom text-indigo border border-indigo rounded-pill px-2.5 py-0.5 fw-bold" style={{ fontSize: '0.65rem' }}>
                          {item.type}
                        </span>
                        <h5 className="fw-bold text-dark dark:text-white mt-1 mb-0">
                          {item.name}
                        </h5>
                      </div>
                    </div>

                    <p className="small text-muted mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3 pt-2 border-top">
                      <span className="small text-muted fw-bold">Required Balance:</span>
                      <span className="fw-black text-warning fs-5 d-flex align-items-center gap-1">
                        <Coins className="w-4 h-4 text-warning" /> {item.price} Coins
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isOwned}
                      className={`btn w-100 py-2.5 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ${
                        isOwned
                          ? 'btn-success text-white'
                          : isAffordable
                          ? 'btn-indigo text-white'
                          : 'btn-light text-muted border'
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" /> Unlocked & Claimed
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 text-warning" /> Redeem Offer ({item.price} Coins)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
