import React from "react";

function CategoryTree({ categories, onEdit, onDelete }) {
  return (
    <ul className="list-group ms-3">
      {categories.map((cat) => (
        <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{cat.name}</strong>
            {cat.subcategories?.length > 0 && (
              <CategoryTree
                categories={cat.subcategories}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
          <div>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => onEdit(cat)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(cat.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CategoryTree;
