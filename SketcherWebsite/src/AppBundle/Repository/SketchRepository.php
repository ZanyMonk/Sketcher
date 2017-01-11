<?php

namespace AppBundle\Repository;

/**
 * SketchRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SketchRepository extends \Doctrine\ORM\EntityRepository
{

    public function getLastSketches($page, $number) {

        $query =  $this->createQueryBuilder('s')
                        ->addOrderBy('s.dateUpload', 'DESC')
                        ->setFirstResult($page * $number)
                        ->setMaxResults($number)
                        ->getQuery();

        return $query->execute();

    }

    public function getMostLikedSketches($page, $number) {

        $query =  $this->createQueryBuilder('s')
					   ->leftJoin('s.likers', 'l')
					   ->select('s, COUNT(l.id) AS HIDDEN nbLikes')
                       ->addOrderBy('nbLikes', 'DESC')
					   ->addOrderBy('s.name', 'ASC')
                       ->groupBy('s.id')
                       ->setFirstResult($page * $number)
                       ->setMaxResults($number)
                       ->getQuery();


        return $query->execute();
    }

    public function getNb() {
        return $this->createQueryBuilder('Sketch')
                        ->select('COUNT(Sketch)')
                        ->getQuery()
                        ->getSingleScalarResult();
    }

    public function getSketchesTitleLike($term, $page, $number) {
        $query = $this->createQueryBuilder('s')
                      ->andWhere('s.name LIKE :term')
                      ->setFirstResult($page * $number)
                      ->setMaxResults($number)
                      ->setParameter('term', '%'.$term.'%')
                      ->getQuery();

        return $query->execute();
    }

    public function getSketchesTitleLike_NB($term) {
        return $this->createQueryBuilder('s')
                        ->select('COUNT(s)')
                        ->andWhere('s.name LIKE :term')
                        ->setParameter('term', '%'.$term.'%')
                        ->getQuery()
                        ->getSingleScalarResult();
    }


}
