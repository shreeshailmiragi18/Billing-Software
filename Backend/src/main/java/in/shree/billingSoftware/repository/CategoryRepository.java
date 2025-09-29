package in.shree.billingSoftware.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import in.shree.billingSoftware.entity.CategoryEntity;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
    Optional<CategoryEntity> findByCategoryId(String categoryId);
}
