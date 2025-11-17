/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { FavoriteProject, useFavoritesStore } from '@/lib/state';
import './FavoriteCard.css';

interface FavoriteCardProps {
  project: FavoriteProject;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ project }) => {
  const updateNotes = useFavoritesStore(state => state.updateNotes);
  const [notes, setNotes] = useState(project.notes);

  // Debounce the notes update to avoid excessive re-renders
  useEffect(() => {
    const handler = setTimeout(() => {
      if (notes !== project.notes) {
        updateNotes(project.id, notes);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [notes, project.id, project.notes, updateNotes]);
  
  // Update local state if the project notes change from the store
  // (e.g. from another component, though unlikely in this app)
  useEffect(() => {
    setNotes(project.notes);
  }, [project.notes]);

  return (
    <div className="favorite-card">
      <img src={project.imageUrl} alt={project.name} className="favorite-card-image" />
      <div className="favorite-card-content">
        <h4 className="favorite-card-name">{project.name}</h4>
        <p className="favorite-card-community">{project.community}</p>
        
        <h5 className="favorite-card-section-title">Key Features</h5>
        <ul className="favorite-card-features">
          {project.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {project.project_specs && (
          <>
            <h5 className="favorite-card-section-title">Project Specs</h5>
            <div className="favorite-card-specs">
              <div className="spec-item">
                <span className="spec-label">Avg. Price/SqFt</span>
                <span className="spec-value">
                  AED {new Intl.NumberFormat('en-US').format(project.project_specs.avg_price_per_sqft)}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Available Unit Sizes</span>
                <ul className="spec-unit-list">
                  {project.project_specs.unit_types.map((ut, index) => (
                    <li key={index}>
                      <strong>{ut.unit_type}:</strong> ~{new Intl.NumberFormat('en-US').format(ut.avg_size_sqft)} sq. ft.
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        <h5 className="favorite-card-section-title">My Research Notes</h5>
        <textarea
          className="favorite-card-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your thoughts, questions, or follow-up items here..."
        />
      </div>
    </div>
  );
};

export default FavoriteCard;