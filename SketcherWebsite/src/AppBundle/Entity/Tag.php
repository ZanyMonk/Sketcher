<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tag
 *
 * @ORM\Table(name="tag")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TagRepository")
 */
class Tag
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=32, unique=true)
     */
    private $name;

    /**
    * @ORM\ManyToMany(targetEntity="Sketch", inversedBy="tags")
    * @ORM\JoinColumn(name="sketch", referencedColumnName="id")
    */
    private $sketches;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Tag
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->sketches = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add sketch
     *
     * @param \AppBundle\Entity\Sketch $sketch
     *
     * @return Tag
     */
    public function addSketch(\AppBundle\Entity\Sketch $sketch)
    {
        $this->sketches->add($sketch);

        return $this;
    }

    /**
     * Remove sketch
     *
     * @param \AppBundle\Entity\Sketch $sketch
     */
    public function removeSketch(\AppBundle\Entity\Sketch $sketch)
    {
        $this->sketches->removeElement($sketch);
    }

    /**
     * Get sketches
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSketches()
    {
        return $this->sketches;
    }

    /**
     * Get number of sketches
     *
     * @return int
     */
    public function getNbSketches() {
        return $this->sketches->count();
    }

    /*
    * Return sketch from pagination
    * @return \Doctrine\Common\Collections\Collection
    */
    public function getSketchesFrom(int $page, int $number) {
        return $this->sketches->slice($page * $number , $number );
    }
}
