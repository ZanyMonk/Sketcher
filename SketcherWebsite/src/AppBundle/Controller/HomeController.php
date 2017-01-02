<?php

namespace AppBundle\Controller;

use AppBundle\Form\UserType;
use AppBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormError;

class HomeController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Route("/home", name="homepageLiteral")
     */
    public function indexAction(Request $request)
    {
        return $this->render('home/index.html.twig');
    }

	/**
	 *
	 * @Route("/gallery", name="gallery")
	 */
	public function galleryAction(Request $request)
	{
		return $this->render('home/gallery.html.twig');
	}

	/**
	 *
	 * @Route("/profile/{username}", name="profile")
	 */
	public function profileAction(Request $request, $username)
	{
		$user = $this->getDoctrine()
			->getRepository('AppBundle:User')
			->findOneBy(
				array('username' => $username)
			);

		return $this->render(
			'home/profile.html.twig',
			array(
				'name' => $username,
				'user' => $user
			)
		);
	}

	/**
	 *
	 * @Route("/me", name="editProfile")
	 */
	public function editProfileAction(Request $request)
	{
		$user = $this->getUser();
		$form = $this->createForm(UserType::class, $user);

		$form->remove('plainPassword')
		->add('plainPassword', PasswordType::class, array(
			'label' => 'Current password',
			'required' => true
		))
		->add('newPassword', RepeatedType::class, array(
			'required' => false,
			'mapped' => false,
			'type'	=> PasswordType::class,
			'first_options'		=> array('label' => 'Password'),
			'second_options'	=> array('label' => 'Repeat password')
		));

		$form->handleRequest($request);

		if($form->isSubmitted() && $form->isValid()) {
			if($this->get('security.password_encoder')->isPasswordValid(
				$user,
				$form->get('plainPassword')->getData()
			)) {
				if($form->get('newPassword')->getData()) { // New password requested
					$pass = $this->get('security.password_encoder')->encodePassword(
						$user,
						$form->get('newPassword')->getData()
					);
					$user->setPassword($pass);
				}

				$this->get('session')->set('_locale', $user->getLocale());

				$db = $this->getDoctrine()->getManager();
				$db->persist($user);
				$db->flush();

				return $this->redirectToRoute('editProfile');
			} else { // Wrong password
				$form->get('plainPassword')->addError(
					new FormError($this->get('translator')->trans("Wrong password."))
				);
			}
		}

		return $this->render(
			'home/editProfile.html.twig',
			array(
				'form' => $form->createView()
			)
		);
	}
}
