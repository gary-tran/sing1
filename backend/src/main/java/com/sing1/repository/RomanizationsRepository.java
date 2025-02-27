package com.sing1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sing1.model.Romanizations;

import java.util.UUID;

@Repository
public interface RomanizationsRepository extends JpaRepository<Romanizations, UUID> {

}
