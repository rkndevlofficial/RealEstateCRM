import { useEffect, useState } from "react";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";
import { validateProjectForm } from "../utils/validators";
import companyInfo from "../data/companyInfo";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [brochureUploading, setBrochureUploading] = useState(false);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const emptyUnit = {
    type: "",
    area: "",
    price: "",
  };

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: "",
    images: [""],
    status: "Available",
    floors: "",
    unitTypes: [emptyUnit],
    highlights: [""],
    locationAdvantages: [""],
    brochure: "",
    mapLink: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");

      const projectsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProjects(projectsData);
    } catch (error) {
      console.log("Projects fetch error:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      project.name?.toLowerCase().includes(searchText) ||
      project.location?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const isValidUrl = (value) => {
    if (!value) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateUnitTypes = () => {
    const filledUnits = formData.unitTypes.filter(
      (unit) =>
        unit.type.trim() !== "" ||
        String(unit.area).trim() !== "" ||
        String(unit.price).trim() !== ""
    );

    for (let i = 0; i < filledUnits.length; i++) {
      const unit = filledUnits[i];

      if (!unit.type.trim()) {
        return `Unit type ${i + 1}: Type is required`;
      }

      if (unit.area && Number(unit.area) <= 0) {
        return `Unit type ${i + 1}: Enter valid area`;
      }

      if (unit.price && Number(unit.price) <= 0) {
        return `Unit type ${i + 1}: Enter valid price`;
      }
    }

    return null;
  };

  const validateAdminProjectForm = () => {
    const basicError = validateProjectForm(formData);

    if (basicError) {
      return basicError;
    }

    const unitError = validateUnitTypes();

    if (unitError) {
      return unitError;
    }

    if (formData.image && !isValidUrl(formData.image)) {
      return "Enter a valid cover image URL";
    }

    const invalidGalleryUrl = formData.images.find(
      (img) => img.trim() !== "" && !isValidUrl(img)
    );

    if (invalidGalleryUrl) {
      return "Enter valid gallery image URLs";
    }

    if (formData.brochure && !isValidUrl(formData.brochure)) {
      return "Enter a valid brochure URL";
    }

    if (formData.mapLink && !formData.mapLink.startsWith("https://")) {
      return "Map link should start with https://";
    }

    return null;
  };

  const resetForm = (clearMessages = true) => {
    setFormData({
      name: "",
      location: "",
      price: "",
      description: "",
      image: "",
      images: [""],
      status: "Available",
      floors: "",
      unitTypes: [emptyUnit],
      highlights: [""],
      locationAdvantages: [""],
      brochure: "",
      mapLink: "",
    });

    setEditId(null);
    setSubmitting(false);

    if (clearMessages) {
      setFormError("");
      setFormSuccess("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormError("");
    setFormSuccess("");

    if (name === "description") {
      setFormData({
        ...formData,
        [name]: value.slice(0, 2000),
      });
      return;
    }

    if (name === "price" || name === "floors") {
      setFormData({
        ...formData,
        [name]: Number(value) < 0 ? "" : value,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUnitChange = (index, field, value) => {
    setFormError("");
    setFormSuccess("");

    if ((field === "area" || field === "price") && Number(value) < 0) {
      value = "";
    }

    const updatedUnits = [...formData.unitTypes];

    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      unitTypes: updatedUnits,
    });
  };

  const addUnitType = () => {
    setFormError("");
    setFormSuccess("");

    setFormData({
      ...formData,
      unitTypes: [...formData.unitTypes, emptyUnit],
    });
  };

  const removeUnitType = (index) => {
    setFormError("");
    setFormSuccess("");

    const updatedUnits = formData.unitTypes.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      unitTypes: updatedUnits.length ? updatedUnits : [emptyUnit],
    });
  };

  const handleArrayChange = (field, index, value) => {
    setFormError("");
    setFormSuccess("");

    const updatedItems = [...formData[field]];

    updatedItems[index] = value;

    setFormData({
      ...formData,
      [field]: updatedItems,
    });
  };

  const addArrayInput = (field) => {
    const currentItems = formData[field].filter((item) => item.trim() !== "");

    if (currentItems.length >= 20) {
      alert("Maximum 20 items allowed");
      return;
    }

    setFormError("");
    setFormSuccess("");

    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayInput = (field, index) => {
    setFormError("");
    setFormSuccess("");

    const updatedItems = formData[field].filter((_, i) => i !== index);

    setFormData({
      ...formData,
      [field]: updatedItems.length ? updatedItems : [""],
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Cover image size should be less than 5MB");
      e.target.value = "";
      return;
    }

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploading(true);
      setFormError("");
      setFormSuccess("");

      const res = await API.post("/uploads/image", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        ...formData,
        image: res.data.imageUrl,
      });

      alert("Cover Image Uploaded Successfully ✅");
    } catch (error) {
      console.log("UPLOAD ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Image Upload Failed ❌");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));

    if (invalidFile) {
      alert("Only JPG, PNG, or WEBP gallery images are allowed");
      e.target.value = "";
      return;
    }

    const largeFile = files.find((file) => file.size > 5 * 1024 * 1024);

    if (largeFile) {
      alert("Each gallery image should be less than 5MB");
      e.target.value = "";
      return;
    }

    const existingImages = formData.images.filter((img) => img.trim() !== "");

    if (existingImages.length + files.length > 20) {
      alert("Maximum 20 gallery photos allowed");
      e.target.value = "";
      return;
    }

    const galleryData = new FormData();

    files.forEach((file) => {
      galleryData.append("images", file);
    });

    try {
      setGalleryUploading(true);
      setFormError("");
      setFormSuccess("");

      const res = await API.post("/uploads/gallery", galleryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImages = res.data.images || [];

      setFormData({
        ...formData,
        images: [...existingImages, ...uploadedImages],
      });

      alert("Gallery Images Uploaded Successfully ✅");
    } catch (error) {
      console.log(
        "GALLERY UPLOAD ERROR:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Gallery Upload Failed ❌");
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const handleBrochureUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF brochure is allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Brochure size should be less than 10MB");
      e.target.value = "";
      return;
    }

    const brochureData = new FormData();
    brochureData.append("brochure", file);

    try {
      setBrochureUploading(true);
      setFormError("");
      setFormSuccess("");

      const res = await API.post("/uploads/brochure", brochureData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        ...formData,
        brochure: res.data.brochureUrl,
      });

      alert("Brochure Uploaded Successfully ✅");
    } catch (error) {
      console.log(
        "BROCHURE UPLOAD ERROR:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Brochure Upload Failed ❌");
    } finally {
      setBrochureUploading(false);
      e.target.value = "";
    }
  };

  const handleGalleryChange = (index, value) => {
    setFormError("");
    setFormSuccess("");

    const updatedImages = [...formData.images];

    updatedImages[index] = value;

    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const addGalleryInput = () => {
    const currentImages = formData.images.filter((img) => img.trim() !== "");

    if (currentImages.length >= 20) {
      alert("Maximum 20 photos allowed");
      return;
    }

    setFormError("");
    setFormSuccess("");

    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const removeGalleryInput = (index) => {
    setFormError("");
    setFormSuccess("");

    const updatedImages = formData.images.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      images: updatedImages.length ? updatedImages : [""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateAdminProjectForm();

    if (validationError) {
      setFormError(validationError);
      setFormSuccess("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      brochure: formData.brochure.trim(),
      mapLink: formData.mapLink.trim(),
      price: Number(formData.price),
      floors: Number(formData.floors) || 0,

      unitTypes: formData.unitTypes
        .filter((unit) => unit.type.trim() !== "")
        .map((unit) => ({
          type: unit.type.trim(),
          area: Number(unit.area) || 0,
          price: Number(unit.price) || 0,
        })),

      images: formData.images
        .filter((img) => img.trim() !== "")
        .map((img) => img.trim())
        .slice(0, 20),

      highlights: formData.highlights
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
        .slice(0, 20),

      locationAdvantages: formData.locationAdvantages
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
        .slice(0, 20),
    };

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      if (editId) {
        await API.put(`/projects/${editId}`, payload);
        setFormSuccess("Project updated successfully ✅");
      } else {
        await API.post("/projects", payload);
        setFormSuccess("Project added successfully ✅");
      }

      resetForm(false);
      fetchProjects();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log("ADD/UPDATE ERROR:", error.response?.data || error.message);
      setFormError(error.response?.data?.message || "Something went wrong ❌");
      setFormSuccess("");
    } finally {
      setSubmitting(false);
    }
  };

  const editProject = (project) => {
    setFormData({
      name: project.name || "",
      location: project.location || "",
      price: project.price ?? "",
      description: project.description || "",
      image: project.image || "",
      images: project.images?.length ? project.images : [""],
      status: project.status || "Available",
      floors: project.floors || "",
      unitTypes:
        project.unitTypes?.length > 0
          ? project.unitTypes
          : [
              {
                type: "",
                area: "",
                price: "",
              },
            ],
      highlights: project.highlights?.length ? project.highlights : [""],
      locationAdvantages: project.locationAdvantages?.length
        ? project.locationAdvantages
        : [""],
      brochure: project.brochure || "",
      mapLink: project.mapLink || "",
    });

    setEditId(project._id);
    setFormError("");
    setFormSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);
      alert("Project Deleted ✅");
      fetchProjects();
    } catch (error) {
      console.log("Delete error:", error.response?.data || error.message);
      alert("Delete Failed ❌");
    }
  };

  const formatMoney = (amount) => {
    const value = Number(amount || 0);

    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(2)} Lakh`;
    }

    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  const getStatusClass = (status) => {
    if (status === "Available") return "bg-green-100 text-green-700";
    if (status === "Upcoming") return "bg-[#CDB52B]/20 text-[#7A6A0A]";
    if (status === "Sold") return "bg-red-100 text-red-700";

    return "bg-slate-100 text-slate-700";
  };

  const inputClass =
    "w-full border border-slate-200 bg-white p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition";

  const sectionClass =
    "mt-6 bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 sm:p-5 rounded-3xl";

  const darkButtonClass =
    "bg-[#35434A] hover:bg-[#263238] text-white px-4 py-2.5 rounded-xl font-bold transition";

  const goldButtonClass =
    "bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-4 py-2.5 rounded-xl font-bold transition";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[#CDB52B] font-extrabold mb-2 tracking-[0.22em] uppercase text-xs sm:text-sm">
                Projects CRM
              </p>

              <h1 className="text-3xl sm:text-4xl font-extrabold">
                Projects Management
              </h1>

              <p className="text-white/65 mt-3 max-w-2xl leading-relaxed">
                Add, update, search, and manage property listings from one
                professional admin panel.
              </p>
            </div>

            {companyInfo.logo && (
              <div className="bg-white rounded-2xl px-4 py-3 shadow-xl w-fit">
                <img
                  src={companyInfo.logo}
                  alt={companyInfo.name || "Aranyak Ventures"}
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 sm:p-8 rounded-3xl shadow-xl border border-slate-100 mb-10 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-2">
                Project Form
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
                {editId ? "Edit Project" : "Add New Project"}
              </h2>
            </div>

            {editId && (
              <span className="bg-[#CDB52B]/20 text-[#7A6A0A] px-4 py-2 rounded-full text-sm font-bold w-fit">
                Editing Mode
              </span>
            )}
          </div>

          {formError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
              {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Starting Price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              className={inputClass}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Upcoming">Upcoming</option>
            </select>

            <input
              type="number"
              name="floors"
              placeholder="Floors"
              value={formData.floors}
              onChange={handleChange}
              min="0"
              className="md:col-span-2 w-full border border-slate-200 bg-white p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
            />
          </div>

          <div className={sectionClass}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#263238]">
                  Unit Types
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Add multiple configurations like 1 BHK, 2 BHK, 3 BHK.
                </p>
              </div>

              <button
                type="button"
                onClick={addUnitType}
                className={`${darkButtonClass} w-full sm:w-fit`}
              >
                + Add Unit
              </button>
            </div>

            <div className="space-y-3">
              {formData.unitTypes.map((unit, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white rounded-2xl p-3 border border-slate-100"
                >
                  <input
                    type="text"
                    placeholder="Unit Type e.g. 1 BHK"
                    value={unit.type}
                    onChange={(e) =>
                      handleUnitChange(index, "type", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Area Sq.Ft."
                    value={unit.area}
                    min="0"
                    onChange={(e) =>
                      handleUnitChange(index, "area", e.target.value)
                    }
                    className={inputClass}
                  />

                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={unit.price}
                    min="0"
                    onChange={(e) =>
                      handleUnitChange(index, "price", e.target.value)
                    }
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => removeUnitType(index)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold py-3 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-xl font-extrabold text-[#263238] mb-3">
              Cover Image
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="image"
                placeholder="Paste Cover Image URL"
                value={formData.image}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className={inputClass}
              />
            </div>

            {uploading && (
              <p className="text-blue-600 font-bold mt-3">
                Uploading cover image...
              </p>
            )}

            {formData.image && (
              <div className="mt-5">
                <p className="font-bold mb-2 text-[#263238]">
                  Cover Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full max-w-md h-56 object-cover rounded-2xl border border-slate-200"
                />
              </div>
            )}
          </div>

          <div className={sectionClass}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#263238]">
                  Gallery Photos
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Upload or paste up to 20 property photos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <label className={`${goldButtonClass} cursor-pointer text-center`}>
                  Upload Photos
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={addGalleryInput}
                  className={darkButtonClass}
                >
                  + Add URL
                </button>
              </div>
            </div>

            {galleryUploading && (
              <p className="text-blue-600 font-bold mb-3">
                Uploading gallery images...
              </p>
            )}

            <div className="space-y-3">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 border border-slate-100"
                >
                  <input
                    type="text"
                    placeholder={`Gallery Image URL ${index + 1}`}
                    value={img}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                    className={`${inputClass} flex-1`}
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryInput(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
              {formData.images
                .filter((img) => img.trim() !== "")
                .slice(0, 20)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-28 object-cover rounded-xl border border-slate-200"
                  />
                ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 sm:p-5 rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#263238]">
                    Project Highlights
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    Example: Near Metro, Clubhouse, Garden Facing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addArrayInput("highlights")}
                  className={`${darkButtonClass} w-full sm:w-fit`}
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {formData.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 border border-slate-100"
                  >
                    <input
                      type="text"
                      placeholder={`Highlight ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("highlights", index, e.target.value)
                      }
                      className={`${inputClass} flex-1`}
                    />

                    <button
                      type="button"
                      onClick={() => removeArrayInput("highlights", index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F7F6EF] border border-[#CDB52B]/15 p-4 sm:p-5 rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#263238]">
                    Location Advantages
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    Example: Metro - 5 Min, School - 2 Min.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addArrayInput("locationAdvantages")}
                  className={`${darkButtonClass} w-full sm:w-fit`}
                >
                  + Add
                </button>
              </div>

              <div className="space-y-3">
                {formData.locationAdvantages.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 border border-slate-100"
                  >
                    <input
                      type="text"
                      placeholder={`Location Advantage ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(
                          "locationAdvantages",
                          index,
                          e.target.value
                        )
                      }
                      className={`${inputClass} flex-1`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeArrayInput("locationAdvantages", index)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-xl font-extrabold text-[#263238] mb-3">
              Brochure & Map
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="brochure"
                placeholder="Brochure PDF URL"
                value={formData.brochure}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={handleBrochureUpload}
                className={inputClass}
              />

              <input
                type="text"
                name="mapLink"
                placeholder="Google Map Embed URL"
                value={formData.mapLink}
                onChange={handleChange}
                className="md:col-span-2 w-full border border-slate-200 bg-white p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
              />
            </div>

            {brochureUploading && (
              <p className="text-blue-600 font-bold mt-3">
                Uploading brochure...
              </p>
            )}

            {formData.brochure && (
              <a
                href={formData.brochure}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
              >
                📄 View Brochure
              </a>
            )}
          </div>

          <textarea
            name="description"
            rows="5"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            maxLength="2000"
            className="w-full border border-slate-200 bg-white p-3.5 rounded-xl mt-6 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
          />

          <p className="text-right text-xs text-slate-400 mt-2">
            {formData.description.length}/2000 characters
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              type="submit"
              disabled={
                submitting || uploading || galleryUploading || brochureUploading
              }
              className="bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-extrabold transition"
            >
              {submitting
                ? editId
                  ? "Updating..."
                  : "Adding..."
                : editId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-extrabold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-3xl shadow border border-slate-100 p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by project name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClass}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
              All Projects
            </h2>

            <span className="bg-[#35434A] text-white px-4 py-2 rounded-full text-sm w-fit">
              {filteredProjects.length} / {projects.length} Projects
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow text-center text-gray-500 border border-slate-100">
              No Projects Found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition flex flex-col lg:flex-row justify-between gap-5 lg:items-center"
                >
                  <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                    <img
                      src={
                        project.image ||
                        "https://placehold.co/120x90?text=Property"
                      }
                      alt={project.name}
                      className="w-full sm:w-28 h-44 sm:h-24 object-cover rounded-2xl bg-slate-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-[#263238] wrap-break-word">
                        {project.name}
                      </h3>

                      <p className="text-gray-500 wrap-break-word">
                        {project.location}
                      </p>

                      <p className="text-[#9CA83A] font-extrabold mt-1">
                        {formatMoney(project.price)}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600">
                        {project.floors > 0 && (
                          <span className="bg-slate-100 px-3 py-1 rounded-full">
                            🏢 {project.floors} Floors
                          </span>
                        )}

                        {project.unitTypes?.length > 0 && (
                          <span className="bg-slate-100 px-3 py-1 rounded-full">
                            🏠 {project.unitTypes.length} Unit Types
                          </span>
                        )}

                        {project.images?.length > 0 && (
                          <span className="bg-slate-100 px-3 py-1 rounded-full">
                            🖼️ {project.images.length} Photos
                          </span>
                        )}

                        {project.highlights?.length > 0 && (
                          <span className="bg-[#CDB52B]/20 text-[#7A6A0A] px-3 py-1 rounded-full">
                            ⭐ {project.highlights.length} Highlights
                          </span>
                        )}

                        {project.locationAdvantages?.length > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            📍 {project.locationAdvantages.length} Location
                          </span>
                        )}

                        {project.brochure && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            📄 Brochure
                          </span>
                        )}

                        {project.mapLink && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            🗺️ Map
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status || "Available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProjects;