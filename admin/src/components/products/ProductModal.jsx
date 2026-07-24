import { useState } from 'react'
import apiClient from '../../utils/apiClient'

function ProductModal({ product, onClose, onSubmit }) {
  // Normalize incoming fields
  const getInitialForm = () => {
    if (product) {
      return {
        ...product,
        stockCount: product.stockCount !== undefined ? product.stockCount : (product.stock || 0),
        galleryImages: product.galleryImages || (product.images || []),
        occasion: product.occasion || [],
        isBestSeller: !!product.isBestSeller,
        isNewArrival: !!product.isNewArrival,
        isSale: !!product.isSale,
        published: product.published !== undefined ? !!product.published : true,
        featured: !!product.featured,
        estimatedDelivery: product.estimatedDelivery || '3–5 Days',
        finish: product.finish || 'Polished',
        lowStockAlert: product.lowStockAlert || 5,
        originalPrice: product.originalPrice || product.price || 0,
        collection: product.collection || 'Heritage',
        description: product.description || product.shortDescription || '',
        sizes: product.sizes || [],
      };
    }
    return {
      name: '',
      slug: '',
      sku: '',
      category: 'Rings',
      collection: 'Heritage',
      description: '',
      image: '',
      hoverImage: '',
      galleryImages: [],
      price: '',
      originalPrice: '',
      stockCount: '',
      lowStockAlert: 5,
      isBestSeller: false,
      isNewArrival: false,
      isSale: false,
      occasion: ['Daily Wear'],
      finish: 'Polished',
      estimatedDelivery: '3–5 Days',
      published: true,
      featured: false,
      metaTitle: '',
      metaDescription: '',
      sizes: [],
    };
  };

  const [form, setForm] = useState(getInitialForm());
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  // Specific error messages
  const [mainImageError, setMainImageError] = useState('');
  const [hoverImageError, setHoverImageError] = useState('');
  const [galleryError, setGalleryError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCheckbox = e => setForm({ ...form, [e.target.name]: e.target.checked })
  
  const handleOccasion = (occ) => {
    const list = form.occasion || [];
    const next = list.includes(occ) ? list.filter(x => x !== occ) : [...list, occ];
    setForm({ ...form, occasion: next });
  };

  const handleAddSize = () => {
    const input = document.getElementById('newSizeInput');
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;

    const exists = form.sizes?.some(s => s.value.trim().toLowerCase() === value.toLowerCase());
    if (exists) {
      alert('Size already exists');
      return;
    }

    const nextSizes = [...(form.sizes || []), { value: value.trim(), available: true }];
    setForm({ ...form, sizes: nextSizes });
    input.value = '';
  };

  const handleToggleSizeAvailability = (index) => {
    const nextSizes = (form.sizes || []).map((s, i) => i === index ? { ...s, available: !s.available } : s);
    setForm({ ...form, sizes: nextSizes });
  };

  const handleRemoveSize = (index) => {
    const nextSizes = (form.sizes || []).filter((_, i) => i !== index);
    setForm({ ...form, sizes: nextSizes });
  };

  const removeGalleryImage = index => {
    setForm({ ...form, galleryImages: (form.galleryImages || []).filter((_, i) => i !== index) });
  };

  const addGalleryImage = (url) => {
    if (url && (form.galleryImages?.length || 0) < 6) {
      setForm({ ...form, galleryImages: [...(form.galleryImages || []), url] });
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (field === 'image') {
      setUploadingImage(true);
      setMainImageError('');
    }
    if (field === 'hoverImage') {
      setUploadingHover(true);
      setHoverImageError('');
    }
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient('/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForm(current => ({ ...current, [field]: data.url }));
      } else {
        const msg = data.message || 'Upload failed.';
        if (field === 'image') setMainImageError(msg);
        if (field === 'hoverImage') setHoverImageError(msg);
      }
    } catch (err) {
      console.error(err);
      const msg = 'Network error. Verify server is running on port 5000.';
      if (field === 'image') setMainImageError(msg);
      if (field === 'hoverImage') setHoverImageError(msg);
    } finally {
      if (field === 'image') setUploadingImage(false);
      if (field === 'hoverImage') setUploadingHover(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingGallery(true);
    setGalleryError('');
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient('/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addGalleryImage(data.url);
      } else {
        setGalleryError(data.message || 'Gallery upload failed.');
      }
    } catch (err) {
      console.error(err);
      setGalleryError('Network error. Verify server is running.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitError('');
    
    if (!form.image) {
      setSubmitError('Main Image is required. Please upload an image or enter a URL.');
      return;
    }

    // Automatically sort sizes numerically before saving (2.2 -> 2.4 -> 2.6 -> 2.8)
    const sortedSizes = form.sizes ? [...form.sizes].sort((a, b) => {
      const numA = parseFloat(a.value);
      const numB = parseFloat(b.value);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.value).localeCompare(String(b.value), undefined, { numeric: true });
    }) : [];
    
    // Auto-map/sanitize for submissions
    const payload = {
      ...form,
      sizes: sortedSizes,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice || form.price),
      stockCount: Number(form.stockCount),
      lowStockAlert: Number(form.lowStockAlert),
      // Ensure compatibility with admin App.jsx which expects 'images'
      images: form.galleryImages.length > 0 ? form.galleryImages : [form.image].filter(Boolean),
      // Ensure 'stock' alias exists so App.jsx list update won't crash
      stock: Number(form.stockCount)
    };

    onSubmit(payload);
  };

  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form className="modal product-modal" style={{ width: 'min(780px, 100%)' }} onSubmit={handleSubmit}>
        <div className="modal-head">
          <div>
            <small>{product ? 'EDIT' : 'NEW'} PRODUCT</small>
            <h2>{product ? 'Update product' : 'Add to catalogue'}</h2>
          </div>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="form-sections" style={{ display: 'grid', gap: '20px' }}>
          {/* 1. Basic Information */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>BASIC INFORMATION</legend>
            <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <label className="wide">Product name<input required name="name" value={form.name} onChange={update} /></label>
              <label>SKU<input required name="sku" value={form.sku} onChange={update} /></label>
              <label>Category
                <select name="category" value={form.category} onChange={update}>
                  <option>Rings</option>
                  <option>Necklaces</option>
                  <option>Earrings</option>
                  <option>Bracelets</option>
                  <option>Bangles</option>
                  <option>Brooch</option>
                  <option>Organizer</option>
                </select>
              </label>
              <label>Collection
                <select name="collection" value={form.collection} onChange={update}>
                  <option>Heritage</option>
                  <option>Modern Minimalist</option>
                  <option>Nature's Grace</option>
                  <option>Classic Pearl</option>
                  <option>Home & Care</option>
                </select>
              </label>
              <label className="wide">Short Description
                <textarea required name="description" value={form.description} onChange={update} style={{ width: '100%', height: '70px', border: '1px solid #e6dfd6', borderRadius: '10px', padding: '10px', font: 'inherit' }} />
              </label>
            </div>
          </fieldset>

          {/* 2. Images Section */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>PRODUCT IMAGES</legend>
            <div className="form-grid">
              <label>Main Image URL
                <input name="image" value={form.image} onChange={update} placeholder="https://..." />
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} style={{ display: 'block', marginTop: '6px', fontSize: '11px' }} />
                {uploadingImage && <small style={{ color: '#b88a44', display: 'block', marginTop: '2px' }}>Uploading Main Image...</small>}
                {mainImageError && <div style={{ color: 'red', fontSize: '11px', marginTop: '4px' }}>{mainImageError}</div>}
                {form.image && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={form.image} alt="Main Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1c7bd' }} />
                    <span style={{ fontSize: '11px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{form.image}</span>
                  </div>
                )}
              </label>

              <label>Hover Image URL
                <input name="hoverImage" value={form.hoverImage} onChange={update} placeholder="https://..." />
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'hoverImage')} style={{ display: 'block', marginTop: '6px', fontSize: '11px' }} />
                {uploadingHover && <small style={{ color: '#b88a44', display: 'block', marginTop: '2px' }}>Uploading Hover Image...</small>}
                {hoverImageError && <div style={{ color: 'red', fontSize: '11px', marginTop: '4px' }}>{hoverImageError}</div>}
                {form.hoverImage && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={form.hoverImage} alt="Hover Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1c7bd' }} />
                    <span style={{ fontSize: '11px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{form.hoverImage}</span>
                  </div>
                )}
              </label>
              
              <div className="wide">
                <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Gallery Images ({form.galleryImages?.length || 0}/6)</span>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    id="newGalleryUrl"
                    placeholder="Paste image URL here..."
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1c7bd', borderRadius: '4px' }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value.trim();
                        if (val) {
                          addGalleryImage(val);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      const el = document.getElementById('newGalleryUrl');
                      if (el.value.trim()) {
                        addGalleryImage(el.value.trim());
                        el.value = '';
                      }
                    }}
                  >
                    Add URL
                  </button>
                  <span style={{ fontSize: '12px', color: '#b88a44' }}>or</span>
                  <input type="file" accept="image/*" onChange={handleGalleryUpload} style={{ fontSize: '11px' }} />
                  {uploadingGallery && <small style={{ color: '#b88a44', display: 'block', marginTop: '2px' }}>Uploading...</small>}
                </div>

                {galleryError && <div style={{ color: 'red', fontSize: '11px', marginBottom: '10px' }}>{galleryError}</div>}
                {submitError && <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{submitError}</div>}
                
                <div className="image-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {form.galleryImages?.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden' }}>
                      <img src={url} alt="Gallery Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(46,36,28,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '15px', height: '15px', cursor: 'pointer', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* 3. Pricing & Inventory */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>PRICING & INVENTORY</legend>
            <div className="form-grid">
              <label>Price (₹)<input required type="number" min="0" name="price" value={form.price} onChange={update} /></label>
              <label>Original Price (₹)<input type="number" min="0" name="originalPrice" value={form.originalPrice} onChange={update} /></label>
              <label>Stock quantity<input required type="number" min="0" name="stockCount" value={form.stockCount} onChange={update} /></label>
              <label>Low stock alert threshold<input type="number" min="0" name="lowStockAlert" value={form.lowStockAlert} onChange={update} /></label>
            </div>
          </fieldset>

          {/* Sizes fieldset */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>AVAILABLE SIZES (OPTIONAL)</legend>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <input
                type="text"
                id="newSizeInput"
                placeholder="e.g. 2.2, 2.4, S, M, L"
                style={{ padding: '8px 12px', border: '1px solid #d1c7bd', borderRadius: '6px', font: 'inherit', width: '150px' }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
              />
              <button
                type="button"
                className="secondary"
                onClick={handleAddSize}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #2e241c', cursor: 'pointer' }}
              >
                Add Size
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {form.sizes && form.sizes.map((s, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '6px 12px', 
                  border: '1px solid #ece7df', 
                  borderRadius: '20px',
                  backgroundColor: s.available ? '#fdfdfc' : '#f5f5f5',
                  opacity: s.available ? 1 : 0.6
                }}>
                  <input 
                    type="checkbox" 
                    checked={s.available} 
                    onChange={() => handleToggleSizeAvailability(idx)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#2e241c' }}>{s.value}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSize(idx)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#8c8276', 
                      cursor: 'pointer', 
                      fontSize: '14px', 
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {(!form.sizes || form.sizes.length === 0) && (
                <span style={{ fontSize: '12px', color: '#8c8276', fontStyle: 'italic' }}>No sizes added. This product will not require size selection.</span>
              )}
            </div>
          </fieldset>

          {/* 4. Specifications & Badges */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>PRODUCT SPECIFICATIONS & BADGES</legend>
            <div className="form-grid">
              <label>Finish
                <select name="finish" value={form.finish} onChange={update}>
                  <option>Polished</option>
                  <option>Glossy</option>
                  <option>Matte</option>
                </select>
              </label>
              <label>Estimated Delivery
                <select name="estimatedDelivery" value={form.estimatedDelivery} onChange={update}>
                  <option>3–5 Days</option>
                  <option>2–4 Days</option>
                  <option>5–7 Days</option>
                </select>
              </label>

              <div className="wide" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '8px' }}>
                <span className="wide" style={{ fontSize: '11px', fontWeight: 'bold' }}>Badges</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
                  <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleCheckbox} />
                  Best Seller
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
                  <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleCheckbox} />
                  New Arrival
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
                  <input type="checkbox" name="isSale" checked={form.isSale} onChange={handleCheckbox} />
                  On Sale
                </label>
              </div>

              <div className="wide" style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Occasion</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {['Daily Wear', 'Office Wear', 'Party Wear', 'Wedding', 'Festive'].map(occ => (
                    <label key={occ} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'normal', flexDirection: 'row', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.occasion?.includes(occ)} onChange={() => handleOccasion(occ)} />
                      {occ}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* 5. Visibility & SEO */}
          <fieldset style={{ border: '1px solid #ece7df', borderRadius: '10px', padding: '16px' }}>
            <legend style={{ padding: '0 8px', fontWeight: 'bold', fontSize: '11px', color: '#b88a44', letterSpacing: '1px' }}>VISIBILITY & SEO</legend>
            <div className="form-grid">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row', marginTop: '12px' }}>
                <input type="checkbox" name="published" checked={form.published} onChange={handleCheckbox} />
                Published (Visible in Shop listings)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row', marginTop: '12px' }}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleCheckbox} />
                Featured Listing
              </label>
              <label className="wide">SEO Meta Title<input name="metaTitle" value={form.metaTitle} onChange={update} placeholder="Fallback to name if blank" /></label>
              <label className="wide">SEO Meta Description<input name="metaDescription" value={form.metaDescription} onChange={update} /></label>
            </div>
          </fieldset>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary">{product ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
    </div>
  )
}

export default ProductModal;
